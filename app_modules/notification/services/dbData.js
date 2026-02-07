
const q = require('q')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')

class Payment {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  getList (limit, offset, userId) {
    __logger.info('GetList:')
    const doesGetList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getList(), [userId, limit, offset, userId])
      .then(result => {
        __logger.info('dbData: GetList(): then 1:', result[1].length)
        if (result && result[1].length > 0) {
          doesGetList.resolve(result[0])
        } else {
          doesGetList.resolve([])
        }
      })
      .catch(err => {
        __logger.error('GetList :: dbData: error in getList function: ', err)
        doesGetList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesGetList.promise
  }

  updateStatus (userId, notificationId) {
    __logger.info('updateStatus:')
    const doesUpdateStatus = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateStatus(), [1, userId, notificationId, userId])
      .then(result => {
        __logger.info('dbData: updateStatus(): then 1:', result)
        doesUpdateStatus.resolve(result)
      })
      .catch(err => {
        __logger.error('updateStatus :: dbData: error in updateStatus function: ', err)
        doesUpdateStatus.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesUpdateStatus.promise
  }
}

module.exports = Payment
