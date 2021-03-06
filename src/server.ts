import type { AddressInfo } from 'net'
import runningAt from 'running-at'
import { createServer, mergeConfig, ViteDevServer } from 'vite'

type ViteConfig = Parameters<typeof createServer>[0]

/**
 * ViteServer return object.
 */
export interface ViteServer {
  /** The local address */
  localAddr: string
  /** The network address */
  networkAddr: string
  /** The Vite dev server instance */
  vite: ViteDevServer
  /** Log function */
  log: (...args: unknown[]) => void
}

/**
 * Creates a vite dev server instance.
 *
 * @param viteConfig Vite configuration.
 * @returns ViteServer
 */
export const createViteServer = async (viteConfig: ViteConfig = {}): Promise<ViteServer> => {
  viteConfig = mergeConfig({}, viteConfig)

  const startViteDevServer = async () => {
    const viteDevServer = await createServer(viteConfig)
    await viteDevServer.listen()
    return viteDevServer
  }

  const viteDevServer = await startViteDevServer()

  const addressInfo = viteDevServer.httpServer!.address() as AddressInfo

  const localAddr = `${
    viteDevServer.config.server.https ? 'https' : 'http'
  }://${addressInfo.address}:${addressInfo.port}`

  let networkAddr = ''
  try {
    networkAddr = `${viteDevServer.config.server.https ? 'https' : 'http'}://${runningAt().ip}:${addressInfo.port}`
  } catch {}

  return {
    localAddr,
    networkAddr,
    vite: viteDevServer,
    log: void 0 as never,
  }
}
