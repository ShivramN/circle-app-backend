var config = require('../../config')
const Logger = require('./log')
module.exports = new Logger(config.logging.log_file, true)
