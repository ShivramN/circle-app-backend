const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __db = require('../../../lib/db')
const __util = require('../../../lib/util')
const queryProvider = require('../queryProvider')

const checkStatus = (req, res) => {
  __logger.info('Inside checkStatus')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getStatus(), [userId])
    .then(data => {
      if (data && data.length > 0) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data[0] })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST })
      }
    })
    .catch(err => {
      __logger.error('error in check Points history function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = checkStatus
