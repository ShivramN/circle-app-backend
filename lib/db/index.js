const config = require('../../config')
const __logger = require('../../lib/logger')

class Databases {
  constructor () {
    __logger.info('databases constructor called.')
    this.mysql = require('./mysql.js')
    this.firebase = require('./firebaseNotification')
  }

  async init () {
    await this.mysql.init(config.circle_app.name)
    await this.firebase.init()
    return 'connections open.'
  }

  async close () {
    await this.mysql.close(config.circle_app.name)
    await this.firebase.close()
    return 'connection closed.'
  }
}

module.exports = new Databases()
