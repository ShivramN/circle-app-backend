const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const queryProvider = require('../queryProvider')
const __util = require('../../../lib/util')
const __db = require('../../../lib/db')

const settingList = (req, res) => {
  __logger.info('Inside settingList')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  __db.mysql.query(__constants.MYSQL_NAME, queryProvider.settingList(), [userId])
    .then(data => {
      if (data && data.length > 0) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data[0] })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.NOT_FOUND })
      }
    })
    .catch(err => {
      __logger.error('error in check setting list function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = settingList
