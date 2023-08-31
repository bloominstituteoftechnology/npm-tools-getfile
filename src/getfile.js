const fs = require('fs')
const upath = require('upath')
const yargs = require('yargs')

const usageMessage = 'Usage: node getfile [file]'
const argErrMessage = 'Please provide a file argument'

module.exports = function (arg, options) {
  const IS_CLI = options?.cli === true
  const IS_MODULE = !IS_CLI

  function handleResult(errorMessage, result) {
    if (errorMessage && IS_MODULE) throw new Error(errorMessage)
    if (errorMessage) console.error(errorMessage)
    if (IS_MODULE) return result
    console.log(result)
  }

  if (IS_CLI) {
    const argv = yargs
      .usage(usageMessage)
      .demandCommand(1, argErrMessage)
      .help('h')
      .alias('h', 'help')
      .argv

    arg = argv._[0]
  }
  const ext = upath.extname(arg)
  const absolutePath = upath.resolve(arg)

  if (fs.existsSync(absolutePath)) {
    return handleResult(null, absolutePath)
  }
  if (!ext) {
    return handleResult(argErrMessage)
  }
  const directoryPath = upath.dirname(absolutePath)
  const filesInFolder = fs.readdirSync(directoryPath)
  const filesOfType = filesInFolder
    .filter(file => upath.extname(file).toLowerCase() === ext.toLowerCase())

  if (filesOfType.length > 0) {
    IS_CLI && console.log(`Found files ${filesOfType.join(', ')}`)
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
    const nextBestAbsolutePath = upath.join(directoryPath, latestFile)
    return handleResult(null, nextBestAbsolutePath)
  }
  return handleResult(`No ${arg} or ${ext} files found in the folder`)
}
