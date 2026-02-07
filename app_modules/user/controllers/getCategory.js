const __logger = require('../../../lib/logger')
const __db = require('../../../lib/db')
const __constants = require('../../../config/constants')
const queryProvider = require('../../admin/queryProvider')
const __util = require('../../../lib/util')
const formatData = require('../../../lib/util/formatData')

const getCategory = (req, res) => {
  __logger.info('Inside getCategory')
  __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getPostFollowerCount(), [])
    .then(data => {
      __logger.info('getCategory function :: Then 1, with or without count')
      const categoryQuery = data?.[0]?.[0].postCount > 0 || data?.[1]?.[0].followersCount > 0 ? queryProvider.getCategory() : queryProvider.getCategorywithPostAndFollower()
      return __db.mysql.query(__constants.MYSQL_NAME, categoryQuery, [])
    })
    .then(data => {
      if (data && data.length > 0) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: formatData(data) })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
      }
    })
    .catch(err => {
      __logger.error('error in getCategory function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getCategory
