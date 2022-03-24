import execa from 'execa'

async function main() {
  console.info(`Building packages`)
  await run('.', `tsc`)
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