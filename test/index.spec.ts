import { exec } from 'child_process'
import { stderr, stdout } from 'stdout-stderr'
import { open, Options } from '../src'

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('Options', () => {
  it('should be correct', () => {
    expect(new Options()).toMatchObject({
      quiet: false,
    })
  })
})

describe('open(file)', () => {
  const io = {
    stdout,
    stderr,
  }

  const collect = () => {
    stdout.stop()
    stderr.stop()
    return {
      stdout: stdout.output,
      stderr: stderr.output,
    }
  }

  beforeEach(() => {
    io.stdout.start()
    io.stderr.start()
  })

  it('starts a vite dev server and serves the file', async () => {
    const server = await open({ file: 'fixture.ts', root: __dirname })

    // wait for stdout to be filled
    await pause(1000)

    expect(collect().stdout).toContain('serving file: fixture.ts')

    await server.vite.close()
  })
})

describe('cli', () => {
  jest.setTimeout(15000)

  it('starts a vite dev server and serves the file', async () => {
    const { stdout } = await new Promise(resolve => {
      const controller = new AbortController()
      const { signal } = controller

      let stdout: any

      const child = exec(
        'node -r ts-node/register ../src/cli.ts fixture.ts',
        { cwd: __dirname, signal, encoding: 'utf8' },
        (_error, _stdout) => {
          stdout = _stdout
        }
      )

      child.once('close', () => {
        resolve({ stdout })
      })

      setTimeout(() => {
        try {
          child.kill()
        } catch {
          //
        }
        controller.abort()
      }, 7000)
    })

    expect(stdout).toContain('serving file')
    expect(stdout).toContain('fixture.ts')
  })
})
