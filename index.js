#!/usr/bin/env node
if (require.main === module) {
  require('./src/getfile.js')(null, { cli: true })
} else {
  module.exports = require('./src/getfile.js')
}
