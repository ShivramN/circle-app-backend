const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const userQueryProvider = require('../../user/queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')

class Profile {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  checkUserProfile (otherUserId, userId) {
    __logger.info('dbData: checkUserProfile(): ')
    const doesCheckUserProfile = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, userQueryProvider.checkUserProfile(), [otherUserId, userId, userId, otherUserId])
      .then(result => {
        __logger.info('dbData: checkUserProfile(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckUserProfile.resolve(result[0])
        } else {
          doesCheckUserProfile.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user profile function: ', err)
        doesCheckUserProfile.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUserProfile.promise
  }

  getFollowerList (checkUserId, userId, limit, offset, searchUser = null) {
    __logger.info('dbData: getFollowerList(): ')
    const doesGetFollowerList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, userQueryProvider.getFollowerList(searchUser), [checkUserId, userId, limit, offset])
      .then(result => {
        __logger.info('dbData: getFollowerList(): then 1:', result[0])
        doesGetFollowerList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get follower list function: ', err)
        doesGetFollowerList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetFollowerList.promise
  }

  getFollowingList (checkUserId, userId, limit, offset, searchUser = null) {
    __logger.info('dbData: getFollowingList(): ')
    const doesGetFollowingList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, userQueryProvider.getFollowingList(searchUser), [checkUserId, userId, limit, offset])
      .then(result => {
        __logger.info('dbData: getFollowingList(): then 1:', result[0])
        doesGetFollowingList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get follower list function: ', err)
        doesGetFollowingList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetFollowingList.promise
  }

  checkTransaction (userId) {
    __logger.info('dbData: checkTransaction(): ')
    const doesCheckTransaction = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, userQueryProvider.checkTransaction(), [userId, __constants.STRIPE_STATUS[1]])
      .then(result => {
        __logger.info('dbData: checkTransaction(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckTransaction.resolve(result[0])
        } else {
          doesCheckTransaction.reject({ type: __constants.RESPONSE_MESSAGES.NOT_BUY, err: __constants.RESPONSE_MESSAGES.NOT_BUY.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get follower list function: ', err)
        doesCheckTransaction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckTransaction.promise
  }

  updateSetting (settingDetails, userId) {
    __logger.info('dbData: updateSetting(): ')
    const doesUpdateSetting = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateSetting(), [settingDetails.sharedNews, settingDetails.sharedVoice, settingDetails.sharedEvent, settingDetails.eventAlert, settingDetails.tagVoice, settingDetails.eventInvited, settingDetails.userFollow, userId, userId])
      .then(result => {
        __logger.info('dbData: updateSetting(): then 1:', result[0])
        doesUpdateSetting.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get follower list function: ', err)
        doesUpdateSetting.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateSetting.promise
  }
}

module.exports = Profile
