import execa from 'execa'
import * as fs from 'fs'

const buildDir = './build'
const mermaidDir = './src/cmd/mermaid'
const files = [
  'index.html', 'mermaid.min.js'
]

async function main() {
  console.info(`Building packages`)
  await run('.', `tsc`)
  if (fs.existsSync(buildDir)) {
    if (!fs.existsSync(`${buildDir}/cmd/mermaid`)) {
      fs.mkdirSync(`${buildDir}/cmd/mermaid`)
    }
    files.forEach(file => {
      fs.copyFileSync(`${mermaidDir}/${file}`, `${buildDir}/cmd/mermaid/${file}`)
    })
  }
}

async function run(cwd: string, cmd: string): Promise<execa.ExecaReturnValue<string> | undefined> {
  const args = ['./' + cwd.padEnd(10), cmd]
  console.debug(args.join(' '))
  try {
    return await execa.command(cmd, {
      cwd,
      stdio: 'inherit',
    })
  } catch (_e) {
    const e = _e as execa.ExecaError
    throw new Error(
      `Error running ${cmd} in ${cwd}: (${e.stack || e.message})`,
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})