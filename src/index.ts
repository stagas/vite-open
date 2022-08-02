import chalk from '@stagas/chalk'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { arg } from 'decarg'
import * as fs from 'fs'
import type { ServerResponse } from 'http'
import openInEditor from 'open-in-editor-connect'
import * as path from 'path'
import qrcode from 'qrcode-terminal'
import debug from 'rollup-plugin-debug'
import { mergeConfig } from 'vite'
import type { Connect, InlineConfig as ViteConfig, ViteDevServer } from 'vite'
import babel from 'vite-plugin-babel'
import mdPlugin, { Mode } from 'vite-plugin-markdown'
import virtual from 'vite-plugin-virtual'

export * from 'vite-plugin-virtual'

import { createViteServer, ViteServer } from './server'

export type { ViteServer }

export let virtualPlugin: any

const defaultLog = (...args: unknown[]) => console.log(chalk.blueBright('[vite-open]'), ...args)

export class Options {
  @arg('<file>', 'File to open (.js, .jsx, .ts, .tsx, .md)') file!: string
  @arg('--root', 'Root directory to serve files from') root = '.'
  @arg('--https', 'Use https') https = false
  @arg('--jsx', 'JSX transformer') jsx = 'react'
  @arg('--no-open', 'Do not open browser on startup') noOpen = false
  @arg('--no-force', 'Do not force reoptimization') noForce = false
  @arg('--debugging', 'Debugging pattern') debugging = ''
  @arg('--debugging-this', 'Enable debugging for current package') debuggingThis = false
  @arg('--quiet', 'Quiet output') quiet = false

  log = defaultLog

  virtual: Record<string, any> = {}

  responses: Record<string, {
    type?: string
    content?: string
    fn?: (
      server: ViteDevServer,
      req: Connect.IncomingMessage,
      res: ServerResponse,
      next: Connect.NextFunction,
    ) => void
  }> = {}

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
 * @param options.noForce Do not force reoptimization
 * @param options.debugging Debugging pattern
 * @param options.debuggingThis Enable debugging for current package
 * @param options.quiet Quiet output
 * @return ViteDevServer
 */
export const open = async (options: Partial<Options>): Promise<ViteServer> => {
  options = Object.assign(new Options(), options)

  let { file } = options as Options

  const { log, root, quiet, responses, jsx, debugging, debuggingThis } = options as Options

  const exists = (filename: string) =>
    (('/' + filename) in responses)
    || fs.existsSync(path.join(root, filename))

  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.md', '.html']
  if (extensions.every(x => !file.endsWith(x))) {
    for (const ext of extensions) {
      if (exists(file + ext)) {
        file = file + ext
        break
      }
    }
  }

  if (!exists(file)) {
    !quiet && log('File does not exist:', file)
    process.exit(1)
  }

  !quiet && log('starting...')

  const resolve: ViteConfig['resolve'] = {
    alias: {
      react: jsx,
    },
  }
  const optimizeDeps: ViteConfig['optimizeDeps'] = {
    exclude: [],
  }

  const getPkgName = (): string | void => {
    try {
      const json = fs.readFileSync(path.resolve(path.join(root, 'package.json')), 'utf-8')
      const pkg = JSON.parse(json)
      return pkg.name
    } catch {}
  }

  const aliasPackage = () => {
    try {
      // try to alias package name as a top-level module
      const name = getPkgName()
      if (name) {
        !quiet && log('aliasing:', chalk.cyan(name), '->', chalk.green(root))
        ;(resolve.alias as any)[name] = root
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

  virtualPlugin = virtual(options.virtual)

  optimizeDeps.include = []
  optimizeDeps.force = !options.noForce
  optimizeDeps.esbuildOptions = {
    target: 'es2020',
    legalComments: 'inline',
    keepNames: true,
  }

  const config = mergeConfig(
    options.viteOptions ?? {},
    <ViteConfig> {
      root,
      logLevel: quiet ? 'silent' : 'info',
      clearScreen: false,
      optimizeDeps,
      esbuild: {
        legalComments: 'inline',
        keepNames: true,
        jsx: 'automatic',
      },
      server: {
        https: options.https,
        open: !options.noOpen,
        cors: true,
        host: true,
        headers: options.https
          ? {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
          }
          : {},
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
        options.https && basicSsl(),

        virtualPlugin,

        mdPlugin({ mode: [Mode.HTML] }),

        babel({
          babelConfig: {
            cwd: root,
            sourceMaps: true,
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
              [
                require('@babel/plugin-proposal-private-methods'),
                { loose: true },
              ],
            ],
          },
          filter: /\.(jsx|tsx)$/,
        }),

        {
          name: 'fix-babel-sourcemaps',
          transform(_, id) {
            if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
              const sourcemap = this.getCombinedSourcemap()
              sourcemap.sources[0] = id
            }
            return null
          },
        },

        debug({
          printId: true,
          runtimeDebug: true,
          debugMatcher: debuggingThis ? ((getPkgName() ?? '') + ':*') : debugging,
        }),

        {
          name: 'configure-server',
          configureServer(server: ViteDevServer) {
            // fix url devtools links for consuming by openInEditor
            server.middlewares.use((req, _res, next) => {
              if (req.method === 'POST' && req.url) {
                if (/\/@fs\/.*:\d+/.test(req.url))
                  req.url = req.url!.replace('/@fs', '')
                else if (/.*:\d+/.test(req.url)) {
                  if (!fs.existsSync(req.url.split(':')[0]))
                    req.url = path.resolve(path.join(root, req.url))
                }
              }
              next()
            })

            server.middlewares.use(openInEditor('/', {
              editor: { name: 'code' },
            }))

            server.middlewares.use((req, res, next) => {
              if (req.url === '/favicon.ico') {
                res.setHeader('Content-Type', 'image/svg+xml')
                res.end(
                  /*html*/ `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='47.2' r='34' fill='transparent' stroke='#fff' stroke-width='7.5' /></svg>`
                )
              } else {
                next()
              }
            })

            server.middlewares.use((req, res, next) => {
              // cross origin headers are ignored and show a warning
              // on non-https origins
              if (options.https) {
                res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
                res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
              }

              if (req.url! in responses) {
                const { type, content, fn } = responses[req.url!]
                if (fn) {
                  fn(server, req, res, next)
                  return
                } else if (content) {
                  res.statusCode = 200
                  res.setHeader('Content-Type', type ?? 'application/javascript')
                  res.end(content)
                }
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
        // commonjs({ transformMixedEsModules: true }),
      ],
    } as ViteConfig
  )

  const server = await createViteServer(config)

  server.log = log

  // logs
  !quiet && log('started - serving file:', chalk.yellow(file))
  !quiet && server.vite.printUrls()
  !quiet && server.networkAddr && qrcode.generate(server.networkAddr, { small: true })

  return server
}
