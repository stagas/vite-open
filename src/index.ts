import commonjs from '@rollup/plugin-commonjs'
import chalk from '@stagas/chalk'
import { arg } from 'decarg'
import * as fs from 'fs'
import openInEditor from 'open-in-editor-connect'
import * as path from 'path'
import qrcode from 'qrcode-terminal'
import debug from 'rollup-plugin-debug'
import { InlineConfig as ViteConfig, mergeConfig, ViteDevServer } from 'vite'
import babel from 'vite-plugin-babel'
import mdPlugin, { Mode } from 'vite-plugin-markdown'

import { createViteServer, ViteServer } from './server'

const defaultLog = (...args: unknown[]) => console.log(chalk.blueBright('[vite-open]'), ...args)

export class Options {
  log = defaultLog

  @arg('<file>', 'File to open (.js, .jsx, .ts, .tsx, .md)')
  file!: string

  @arg('--root', 'Root directory to serve files from')
  root = '.'

  @arg('--https', 'Use https')
  https = false

  @arg('--jsx', 'JSX transformer')
  jsx = 'react'

  @arg('--no-open', 'Do not open browser on startup')
  noOpen = false

  @arg('--quiet', 'Quiet output')
  quiet = false

  responses: Record<string, { type: string; content: string }> = {}

  viteOptions: Partial<ViteConfig> = {}
}

const html = (title: string, name: string) =>
  /* html */ `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='47.2' r='34'%0Afill='transparent' stroke='%23fff' stroke-width='7.5' /%3E%3C/svg%3E"
      type="image/svg+xml"
    />
    <title>${title}</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }

      body {
        --light: #eee;
        --dark: #222;
        --color: var(--dark);
        --background: var(--light);
        color: var(--color);
        background: var(--background)
      }

      @media (prefers-color-scheme: dark) {
        body:not(.light) {
          --color: var(--light);
          --background: var(--dark);
        }
      }
    </style>
  </head>
  <body>
    <main></main>
    <script type="module" src="/${name}"></script>
  </body>
</html>
`

/**
 * Open a file in Vite.
 *
 * @param options Open options
 * @param options.log Log function
 * @param options.file File to open (can be a .js or .ts file)
 * @param options.root Root directory to serve files from
 * @param options.https Use https
 * @param options.jsx JSX transformer (default: react)
 * @param options.noOpen Do not open browser on startup
 * @param options.quiet Quiet output
 * @return ViteDevServer
 */
export const open = async (options: Partial<Options>): Promise<ViteServer> => {
  const { log, root, quiet, file, responses, jsx } = (options = Object.assign(
    new Options(),
    options
  ))

  !quiet && log('starting...')

  const resolve: ViteConfig['resolve'] = {
    alias: {
      react: jsx,
    },
  }
  const optimizeDeps: ViteConfig['optimizeDeps'] = {
    exclude: [],
  }

  const aliasPackage = () => {
    try {
      const json = fs.readFileSync(path.resolve(path.join(root, 'package.json')), 'utf-8')

      // try to alias package name as a top-level module
      const pkg = JSON.parse(json)
      if ('name' in pkg) {
        !quiet && log('aliasing:', chalk.cyan(pkg.name), '->', chalk.green(root))
        ;(resolve.alias as any)[pkg.name] = root
      }
    } catch {}
  }

  aliasPackage()

  const visitedPackages = new Set()
  const excludeLinks = (root: string) => {
    if (visitedPackages.has(root)) return
    visitedPackages.add(root)

    try {
      const json = fs.readFileSync(path.resolve(path.join(root, 'package.json')), 'utf-8')
      const pkg = JSON.parse(json)
      for (
        const [name, version] of [
          ...Object.entries(pkg.dependencies),
          ...Object.entries(pkg.devDependencies),
        ] as [string, string][]
      ) {
        if (version.startsWith('file:')) {
          if (!optimizeDeps.exclude!.includes(name)) {
            optimizeDeps.exclude!.push(name)
            const target = path.resolve(root, version.replace('file:', ''))
            excludeLinks(target)
          }
        }
      }
    } catch {}
  }
  excludeLinks(root)

  let entryContents = ''

  // support opening markdown files with github flavored markdown
  const isMarkdown = file.endsWith('.md')
  if (isMarkdown) {
    entryContents = `
      import '/@fs${require.resolve('github-markdown-css')}'
      import { html } from '/${file}'

      document.body.classList.add('markdown-body')
      document.body.style = 'max-width: 830px; margin: 0 auto;'
      document.body.innerHTML = html
    `
  } else if (file.endsWith('.html')) {
    responses['/'] = {
      type: 'text/html',
      content: fs.readFileSync(file, 'utf-8'),
    }
  } else {
    entryContents = `
      import '/${file}'
    `
  }

  responses['/_entry'] = {
    type: 'application/javascript',
    content: entryContents,
  }

  const config = mergeConfig(options.viteOptions ?? {}, {
    root,
    logLevel: quiet ? 'silent' : 'info',
    clearScreen: false,
    optimizeDeps,
    esbuild: {
      legalComments: 'inline',
    },
    server: {
      https: options.https,
      open: !options.noOpen,
      force: true,
      cors: true,
      host: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      fs: {
        allow: [
          // allow parent enables module links to work
          path.resolve(root, '..'),
          path.resolve(path.dirname(require.resolve('github-markdown-css'))),
        ],
      },
    },
    build: {
      target: 'esnext',
    },
    resolve,
    plugins: [
      mdPlugin({ mode: [Mode.HTML] }),
      babel({
        babelConfig: {
          cwd: root,
          sourceMaps: 'inline',
          plugins: [
            [
              require('@babel/plugin-transform-react-jsx'),
              {
                throwIfNamespace: false, // defaults to true
                runtime: 'automatic', // defaults to classic
                importSource: jsx, // defaults to react
                useBuiltIns: true,
                useSpread: true,
              },
            ],
            [
              require('@babel/plugin-transform-typescript'),
              {
                isTSX: true,
                allExtensions: true,
                allowDeclareFields: true,
              },
            ],
            [
              require('@babel/plugin-proposal-decorators'),
              { legacy: true },
            ],
            [
              require('@babel/plugin-proposal-class-properties'),
              { loose: true },
            ],
          ],
        },
        filter: /\.[jt]sx$/,
      }),

      debug({ printId: true }),

      {
        name: 'configure-server',
        configureServer(server: ViteDevServer) {
          server.middlewares.use(openInEditor('.', {
            editor: { name: 'code' },
          }))

          server.middlewares.use((req, res, next) => {
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')

            if (req.url! in responses) {
              const { type, content } = responses[req.url!]
              res.statusCode = 200
              res.setHeader('Content-Type', type)
              res.end(content)
              return
            }
            if (isMarkdown && req.url === '/' + file) {
              server.transformRequest(req.url).then(result => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/javascript')
                res.end(result!.code)
              })
              return
            }
            if (req.url === '/') {
              res.statusCode = 200
              server.transformIndexHtml(req.url, html(file, '_entry')).then(result => {
                res.end(result)
              })
              return
            }
            next()
          })
        },
      },

      commonjs({ transformMixedEsModules: true }),
    ],
  } as ViteConfig)

  const server = await createViteServer(config)

  // logs
  !quiet && log('started - serving file:', chalk.yellow(file))
  !quiet && server.vite.printUrls()
  !quiet && server.networkAddr && qrcode.generate(server.networkAddr, { small: true })

  return server
}
