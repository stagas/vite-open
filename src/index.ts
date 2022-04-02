import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import chalk from '@stagas/chalk'
import { arg } from 'decarg'
import * as fs from 'fs'
import * as path from 'path'
import qrcode from 'qrcode-terminal'
import { InlineConfig as ViteConfig, mergeConfig, ViteDevServer } from 'vite'
import babel from 'vite-plugin-babel-dev'
import { createViteServer, ViteServer } from './server'

const defaultLog = (...args: unknown[]) => console.log(chalk.blueBright('[vite-open]'), ...args)

export class Options {
  log = defaultLog

  @arg('<file>', 'File to open (can be a .js or .ts file)')
  file!: string

  @arg('--root', 'Root directory to serve files from')
  root = process.cwd()

  @arg('--https', 'Use https')
  https = false

  @arg('--jsx', 'JSX transformer')
  jsx = 'react'

  @arg('--quiet', 'Quiet output')
  quiet = false

  responses: Record<string, { type: string; content: string }> = {}

  viteOptions: Partial<ViteConfig> = {}
}

const html = (name: string) =>
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
    <title>${name}</title>
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
 * @param options.quiet Quiet output
 * @return ViteDevServer
 */
export const open = async (options: Partial<Options>): Promise<ViteServer> => {
  const { log, root, quiet, file, responses, jsx } = (options = Object.assign(
    new Options(),
    options,
  ))

  !quiet && log('starting...')

  // try to alias package name as a top-level module
  const resolve: any = { alias: {} }
  try {
    const json = fs.readFileSync(path.resolve(path.join(root, 'package.json')), 'utf-8')
    const pkg = JSON.parse(json)
    if ('name' in pkg) {
      !quiet && log('aliasing:', chalk.cyan(pkg.name), '->', chalk.green(root))
      resolve.alias = {
        [pkg.name]: root,
      }
    }
  } catch {
    //
  }

  resolve.alias.react = jsx

  const config = mergeConfig(options.viteOptions ?? {}, {
    root,
    logLevel: quiet ? 'silent' : 'info',
    clearScreen: false,
    server: {
      https: options.https,
      cors: true,
      force: true,
      host: true,
    },
    build: {
      target: 'esnext',
    },
    resolve,
    plugins: [
      babel({
        babelConfig: {
          cwd: root,
          sourceMaps: 'inline',
          plugins: [
            [
              '@babel/plugin-transform-react-jsx',
              {
                throwIfNamespace: false, // defaults to true
                runtime: 'automatic', // defaults to classic
                importSource: jsx, // defaults to react
                useBuiltIns: true,
                useSpread: true,
              },
            ],
            [
              '@babel/plugin-transform-typescript',
              {
                isTSX: true,
                allExtensions: true,
                allowDeclareFields: true,
              },
            ],
          ],
        },
        filter: /\.[jt]sx$/,
      }),
      {
        name: 'configure-server',
        configureServer(server: ViteDevServer) {
          server.middlewares.use((req, res, next) => {
            if (req.url! in responses) {
              const { type, content } = responses[req.url!]
              res.statusCode = 200
              res.setHeader('Content-Type', type)
              res.end(content)
              return
            }
            if (req.url === '/') {
              res.statusCode = 200
              server.transformIndexHtml(req.url, html(file)).then(result => {
                res.end(result)
              })
              return
            }
            next()
          })
        },
      },
      viteCommonjs(),
    ],
  })

  const server = await createViteServer(config)

  // logs
  !quiet && log('started - serving file:', chalk.yellow(file))
  !quiet && server.vite.printUrls()
  !quiet && qrcode.generate(server.networkAddr, { small: true })

  return server
}
