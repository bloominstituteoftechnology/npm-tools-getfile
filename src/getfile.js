const fs = require('fs')
const upath = require('upath')
const yargs = require('yargs')

const usageMessage = 'Usage: node getfile [file]'
const argError = 'Please provide a file argument'

process.setUncaughtExceptionCaptureCallback(err => {
  console.error(`Something bad happened! ${err}`)
})

module.exports = function () {
  const argv = yargs
    .usage(usageMessage)
    .demandCommand(1, argError)
    .help('h')
    .alias('h', 'help')
    .argv

  const arg = argv._[0]
  const ext = upath.extname(arg)
  const absolutePath = upath.resolve(arg)

  if (fs.existsSync(absolutePath)) {
    console.log(absolutePath)
    return absolutePath
  }
  if (!ext) {
    console.error(argError)
    process.exit(1)
  }
  const directoryPath = upath.dirname(absolutePath)
  const filesInFolder = fs.readdirSync(directoryPath)
  const filesOfType = filesInFolder.filter(file => upath.extname(file).toLowerCase() === ext.toLowerCase())

  if (filesOfType.length > 0) {
    console.log(`Found files ${filesOfType.join(', ')}`)
    let latestFile = null
    let latestModificationTime = 0

    filesOfType.forEach(file => {
      const filePath = upath.join(directoryPath, file)
      const stats = fs.statSync(filePath)
      const modTime = stats.mtimeMs
      if (modTime > latestModificationTime) {
        latestModificationTime = modTime
        latestFile = file
      }
    })
    const result = upath.join(directoryPath, latestFile)
    console.log(result)
    return result
  } else {
    console.error(`No ${arg} or ${ext} files found in the folder`)
    process.exit(1)
  }
}
