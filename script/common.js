require('colors')
const spawnSync = require('child_process').spawnSync

function runShell(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }
  if (result.status !== 0) {
    console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(' ')}`.red)
    process.exit(1)
  }
}

module.exports = {
  runShell,
}
