const __logger = require('../../../lib/logger')
const __db = require('../../../lib/db')
const __constants = require('../../../config/constants')
const queryProvider = require('../queryProvider')
const __util = require('../../../lib/util')

const getSetting = (req, res) => {
  __logger.info('Inside getSetting')
  __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getSetting(), [])
    .then(data => {
      if (data && data.length > 0) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: JSON.parse(data[0].result) })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND })
      }
    })
    .catch(err => {
      __logger.error('error in getSetting function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getSetting
