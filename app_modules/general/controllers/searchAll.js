const __logger = require('../../../lib/logger')
const __db = require('../../../lib/db')
const __constants = require('../../../config/constants')
const queryProvider = require('../queryProvider')
const __util = require('../../../lib/util')

const searchAll = (req, res) => {
  __logger.info('Inside searchAll')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  if (!req?.body?.searchField) {
    return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide a searchField' })
  }
  __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getSearchDeatils(), [userId, `%${req.body.searchField}%`, `%${req.body.searchField}%`, `%${req.body.searchField}`, `%${req.body.searchField}%`, `%${req.body.searchField}%`, __constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, `%${req.body.searchField}%`, `%${req.body.searchField}%`, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3]])
    .then(data => {
      if (data && data.length > 0) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { userDetails: data[0], newsDetails: data[1], voiceDetails: data[2], eventDetails: data[3] } })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
      }
    })
    .catch(err => {
      __logger.error('error in searchAll function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = searchAll
