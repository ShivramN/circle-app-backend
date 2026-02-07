const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')

class MappedData {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  checkFollowMapped (userId, followingId) {
    __logger.info('dbData: checkFollowMapped(): ', userId, followingId)
    const checkFollowed = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkFollowMapped(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: checkFollowMapped(): then 1:', result)
        if (result && result.length === 0) {
          checkFollowed.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, data: {} })
        }
        if (result && result[0].isFollow) {
          checkFollowed.reject({ type: __constants.RESPONSE_MESSAGES.USER_FOLLOWED, data: {} })
        } else {
          checkFollowed.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user followed or not function: ', err)
        checkFollowed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return checkFollowed.promise
  }

  insertNotification (sendUserid, sharedUserId, message, title, notificationType, mediaType, notificationId, mediaId = null) {
    const promises = q.defer()
    __logger.info('inside insertNotification')
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertNotification(), [notificationId, title, notificationType, mediaType, mediaId, sendUserid, 0, sharedUserId, message])
      .then(result => {
        if (result) {
          promises.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('error in insertNotification db call:', err)
        promises.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return promises.promise
  }

  notiffication (message, title, fcmToken) {
    const promises = q.defer()
    __logger.info('inside notiffication')
    __db.firebase.sendNotification(message, title, fcmToken)
      .then(result => {
        if (result) {
          promises.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('error in notiffication db call:', err)
        promises.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return promises.promise
  }

  sendNotification (userId, followingId) {
    __logger.info('dbData: sendNotification(): ', userId, followingId)
    const sendNotification = q.defer()
    const notificationId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkSetting(), [userId, followingId])
      .then(result => {
        if (result && result.length > 0) {
          __logger.info('sendNotification :: then 1', result[0])
          this.insertNotification(followingId, userId, result[0].username + __constants.NOTIFICATION_MESSAGE.userFollow, __constants.MEDIA_TYPE_1[6], __constants.NOTIFICATION_TYPE[6], __constants.MEDIA_TYPE_1[6], notificationId)
          return result[0]
        }
      })
      .then(data => {
        if (data[__constants.NOTIFICATION_TYPE[6]] === 1) this.notiffication(data.username + __constants.NOTIFICATION_MESSAGE.userFollow, __constants.MEDIA_TYPE_1[6], data.fcmToken, __constants.NOTIFICATION_TYPE[6], followingId, notificationId)
        sendNotification.resolve(true)
      })
      .catch(err => {
        __logger.error('dbData: error in send notification function: ', err)
        sendNotification.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return sendNotification.promise
  }

  insertFollowMapped (userId, followingId) {
    __logger.info('dbData: insertFollowMapped(): ', userId, followingId)
    const userFollowMappingId = this.uniqueId.uuid()
    const insertFollower = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertFollowMapped(), [userFollowMappingId, followingId, userId])
      .then(result => {
        __logger.info('dbData: insertFollowMapped(): then 1:', result)
        if (result && result.affectedRows === 1) {
          this.addCount(userId, followingId)
          this.sendNotification(userId, followingId)
          insertFollower.resolve(result)
        } else {
          insertFollower.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert user follow mapped function: ', err)
        insertFollower.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return insertFollower.promise
  }

  addCount (userId, followingId) {
    __logger.info('dbData: addCount(): ', userId, followingId)
    const doesAddCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.addCount(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: addCount(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          doesAddCount.resolve(result)
        } else {
          doesAddCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in add follower count function: ', err)
        doesAddCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesAddCount.promise
  }

  deleteFollowMapped (userId, followingId) {
    __logger.info('dbData: deleteFollowMapped(): ', userId, followingId)
    const doesdeleteFollow = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteFollowMapped(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: deleteFollowMapped(): then 1:', result)
        if (result && result.affectedRows === 1) {
          this.removeCount(userId, followingId)
          doesdeleteFollow.resolve(result)
        } else {
          doesdeleteFollow.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_FOLLOWED, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in delete user follow mapped function: ', err)
        doesdeleteFollow.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesdeleteFollow.promise
  }

  removeCount (userId, followingId) {
    __logger.info('dbData: removeCount(): ', userId, followingId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.removeCount(), [userId, followingId])
      .then(result => {
        __logger.info('dbData: removeCount(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in remove count follower function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }
}

module.exports = MappedData
