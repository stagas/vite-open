import { arg } from 'decarg'
import qrcode from 'qrcode-terminal'
import chalk from '@stagas/chalk'
import { ViteServer, createViteServer } from './server'

const defaultLog = (...args: unknown[]) => console.log(chalk.blueBright('[vite-open]'), ...args)

export class Options {
  log = defaultLog

  @arg('<file>', 'File to open (can be a .js or .ts file)')
  file!: string

  @arg('--root', 'Root directory to serve files from')
  root = process.cwd()

  @arg('--https', 'Use https')
  https = false

  @arg('--quiet', 'Quiet output')
  quiet = false
}

const html = (name: string) => /* html */ `<!DOCTYPE html>
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
 * @param options.quiet Quiet output
 * @return ViteDevServer
 */
export const open = async (options: Partial<Options>): Promise<ViteServer> => {
  const { log, root, quiet, file } = (options = Object.assign(new Options(), options))

  !quiet && log('starting...')

  const server = await createViteServer({
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
    plugins: [
      {
        name: 'configure-server',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
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
    ],
  })

  // logs
  !quiet && log('started - serving file:', chalk.yellow(file))
  !quiet && server.vite.printUrls()
  !quiet && qrcode.generate(server.networkAddr, { small: true })

  return server
}
