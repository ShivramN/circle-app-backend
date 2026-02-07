const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')
const UserService = require('../../user/services/dbData')

class Voices {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  checkVoiceByAll (voiceDetails, userId) {
    __logger.info('dbData: checkVoiceByAll(): ')
    const doesCheckVoiceByAll = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkVoiceByAll(), [voiceDetails.voiceTitle, JSON.stringify(voiceDetails.voiceUrl), JSON.stringify(voiceDetails.voicePlaform), userId, voiceDetails.categoryId])
      .then(result => {
        __logger.info('dbData: checkVoiceByAll(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckVoiceByAll.reject({ type: __constants.RESPONSE_MESSAGES.VOICE_EXISTS, err: __constants.RESPONSE_MESSAGES.VOICE_EXISTS.message })
        } else {
          doesCheckVoiceByAll.resolve(false)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check voice by all function: ', err)
        doesCheckVoiceByAll.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckVoiceByAll.promise
  }

  removeTagUser (voiceId, userId) {
    __logger.info('dbData: removeTagUser(): ', voiceId)
    const doesRemoveTagUser = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.removeTagUser(), [voiceId, userId])
      .then(result => {
        __logger.info('dbData: removeTagUser(): then 1:', result)
        if (result && result.length > 0) {
          doesRemoveTagUser.resolve(true)
        } else {
          doesRemoveTagUser.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in remove all user tag function: ', err)
        doesRemoveTagUser.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveTagUser.promise
  }

  checkUserVoiceById (voiceId, userId) {
    __logger.info('dbData: checkUserVoiceById(): ', voiceId)
    const doesCheckUserVoiceById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUserVoiceById(), [voiceId, userId])
      .then(result => {
        __logger.info('dbData: checkUserVoiceById(): then 1:', result)
        if (result && result.length > 0) {
          this.removeTagUser(voiceId, userId)
          doesCheckUserVoiceById.resolve(result[0])
        } else {
          doesCheckUserVoiceById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user voice by id function: ', err)
        doesCheckUserVoiceById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUserVoiceById.promise
  }

  updateVoice (voiceDetatils, userId) {
    __logger.info('dbData: updateVoice(): ')
    const doesUpdateVoice = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateVoice(), [voiceDetatils.voiceTitle, JSON.stringify(voiceDetatils.voiceUrl), JSON.stringify(voiceDetatils.platform), voiceDetatils.categoryId, userId, voiceDetatils.voiceId, userId])
      .then(result => {
        __logger.info('dbData: updateVoice(): then 1:', result)
        if (result && result.affectedRows > 0) {
          if (voiceDetatils.tagUserId.length > 0) this.tagUser(voiceDetatils.voiceId, userId, voiceDetatils.tagUserId)
          doesUpdateVoice.resolve(userId)
        } else {
          doesUpdateVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update voice by id function: ', err)
        doesUpdateVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateVoice.promise
  }

  tagUser (voiceId, userId, tagUserId) {
    __logger.info('dbData: tagUser(): ')
    const doesTagUser = q.defer()
    const listOfTag = tagUserId.map(element => [this.uniqueId.uuid(), element, voiceId, new Date(), userId])
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.tagUser(), [listOfTag])
      .then(result => {
        __logger.info('dbData: tagUser(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesTagUser.resolve(true)
        } else {
          doesTagUser.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in tagUser voice function: ', err)
        doesTagUser.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesTagUser.promise
  }

  insertVoice (voiceDetatils, userId) {
    __logger.info('dbData: insertVoice(): ')
    const doesInsertVoice = q.defer()
    const voiceId = this.uniqueId.uuid()
    const userService = new UserService()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertVoice(), [voiceId, voiceDetatils.voiceTitle, JSON.stringify(voiceDetatils.voiceUrl), JSON.stringify(voiceDetatils.voicePlaform), voiceDetatils.categoryId, userId, voiceDetatils.categoryId])
      .then(result => {
        __logger.info('dbData: insertVoice(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          userService.updateCount('voice_count = voice_count + 1', userId)
          if (voiceDetatils.tagUserId.length > 0) this.tagUser(voiceId, userId, voiceDetatils.tagUserId)
          doesInsertVoice.resolve(voiceId)
        } else {
          doesInsertVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert voice function: ', err)
        doesInsertVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertVoice.promise
  }

  checkUsersVoiceById (userId, limit, page, categoryId) {
    __logger.info('dbData: checkUsersVoiceById(): ', userId)
    const limitsixty = (60 * limit) / 100
    const limitFourty = (40 * limit) / 100
    const offset = limitsixty * (page - 1)
    const offset1 = limitFourty * (page - 1)
    const doesCheckUsersVoiceById = q.defer()
    let finalResult = []
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUsersVoiceById(), [userId, userId, categoryId, limitsixty, offset, userId, userId, categoryId, limitFourty, offset1])
      .then(result => {
        if (result && (result[0].length > 0) && (result[1].length > 0)) {
          finalResult = result[1].reduce((acc, cur, ind, arr) => {
            if (!result[0].some(itemB => itemB.voiceId === cur.voiceId)) result[0].push(cur)
            if (ind === (arr.length - 1)) acc = result[0]
            return acc
          }, [])
        }
        doesCheckUsersVoiceById.resolve(finalResult)
      })
      .catch(err => {
        __logger.error('dbData: error in check user voice by user id function: ', err)
        doesCheckUsersVoiceById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUsersVoiceById.promise
  }

  checkFollowedVoice (followerId, userId, limit, offset) {
    __logger.info('dbData: checkFollowedVoice(): ')
    const doesCheckFollowedVoice = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkFollowedVoice(), [userId, followerId, userId, followerId, limit, offset, followerId])
      .then(result => {
        __logger.info('dbData: checkFollowedVoice(): then 1:', result[1][0])
        doesCheckFollowedVoice.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in check followed voice function: ', err)
        doesCheckFollowedVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckFollowedVoice.promise
  }

  checkVoiceById (voiceId, userId) {
    __logger.info('dbData: checkVoiceById(): ')
    const doesCheckVoiceById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkVoiceById(), [userId, userId, voiceId])
      .then(result => {
        __logger.info('dbData: checkVoiceById(): then 1:', result[0])
        if (result && result.length > 0) {
          doesCheckVoiceById.resolve(result[0])
        } else {
          doesCheckVoiceById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check voice by id function: ', err)
        doesCheckVoiceById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckVoiceById.promise
  }

  checkCategoryWise (categoryIdList, userId) {
    __logger.info('dbData: checkCategoryWise(): ')
    const doesCheckCategoryWise = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getCategoryWise(), [userId])
      .then(result => {
        __logger.info('dbData: checkCategoryWise(): then 1:', result)
        if (result && result[0]?.categoryId !== null) {
          doesCheckCategoryWise.resolve(result[0].categoryId.split(','))
        } else {
          doesCheckCategoryWise.resolve(categoryIdList)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check category wise function: ', err)
        doesCheckCategoryWise.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckCategoryWise.promise
  }

  async checkSuggestVoice (categoryIdList, userId, limit, offset, categoryId = null) {
    __logger.info('dbData: checkSuggestVoice(): ', categoryIdList, userId)
    const doesCheckSuggestVoice = q.defer()
    // const value = categoryId ?? await this.checkCategoryWise(categoryIdList, userId)
    const value = categoryId ?? categoryIdList
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkSuggestVoice(), [userId, userId, value, limit, offset])
      .then(result => {
        if (result) {
          __logger.info('dbData: checkSuggestVoice(): then 1:', result.length)
          doesCheckSuggestVoice.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check voice by id function: ', err)
        doesCheckSuggestVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckSuggestVoice.promise
  }

  deleteVoiceByID (voiceId, userId, categoryId) {
    __logger.info('dbData: deleteVoiceByID(): ')
    const doesDeleteVoiceByID = q.defer()
    const userService = new UserService()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteVoiceByID(), [false, voiceId, userId, categoryId])
      .then(result => {
        __logger.info('dbData: deleteVoiceByID(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          userService.updateCount('voice_count = voice_count - 1', userId)
          doesDeleteVoiceByID.resolve(result[0])
        } else {
          doesDeleteVoiceByID.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_VOICE.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check voice by id function: ', err)
        doesDeleteVoiceByID.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteVoiceByID.promise
  }

  storeVoice (voiceId, userId) {
    __logger.info('dbData: storeVoice(): ')
    const doesStoreVoice = q.defer()
    const saveVoiceId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.storeVoice(), [saveVoiceId, voiceId, userId])
      .then(result => {
        __logger.info('dbData: storeVoice(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesStoreVoice.resolve(result[0])
        } else {
          doesStoreVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error insert voice store function: ', err)
        doesStoreVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesStoreVoice.promise
  }

  checkVoiceSaved (voiceId, userId) {
    __logger.info('dbData: checkVoiceSaved(): ')
    const doesCheckVoiceSaved = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkVoiceSaved(), [voiceId, userId])
      .then(result => {
        __logger.info('dbData: checkVoiceSaved(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckVoiceSaved.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_SAVED_VOICE, err: __constants.RESPONSE_MESSAGES.ALREADY_SAVED_VOICE.message })
        } else {
          doesCheckVoiceSaved.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error check voice saved function: ', err)
        doesCheckVoiceSaved.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckVoiceSaved.promise
  }

  checkVoiceShared (voiceId, sharedUserId, userId) {
    __logger.info('dbData: checkVoiceShared(): ')
    const doesCheckVoiceShared = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkVoiceShared(), [voiceId, userId, sharedUserId])
      .then(result => {
        __logger.info('dbData: checkVoiceShared(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckVoiceShared.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_SHARED_VOICE, err: __constants.RESPONSE_MESSAGES.ALREADY_SHARED_VOICE.message })
        } else {
          doesCheckVoiceShared.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error check voice ahared function: ', err)
        doesCheckVoiceShared.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckVoiceShared.promise
  }

  insertSharedVoice (voiceId, sharedUserId, userId) {
    __logger.info('dbData: insertSharedVoice(): ')
    const doesInsertSharedVoice = q.defer()
    const insertArr = sharedUserId
      .filter(data => data !== userId)
      .map(data => {
        const sharedVoiceId = this.uniqueId.uuid()
        return [sharedVoiceId, data, voiceId, new Date(), userId]
      })
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertSharedVoice(), [insertArr])
      .then(result => {
        __logger.info('dbData: insertSharedVoice(): then 1:', result)
        doesInsertSharedVoice.resolve(result[0])
      })
      .catch(err => {
        __logger.error('dbData: error insert share voice function: ', err)
        doesInsertSharedVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertSharedVoice.promise
  }

  createdVoiceList (userId, limit, page) {
    __logger.info('dbData: createdVoiceList(): ', userId)
    const doesCreatedVoiceList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.createdVoiceList(), [userId, limit, page, userId])
      .then(result => {
        __logger.info('dbData: createdVoiceList(): then 1:', result[1])
        doesCreatedVoiceList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error created voice List function: ', err)
        doesCreatedVoiceList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCreatedVoiceList.promise
  }

  savedVoiceList (userId, limit, page) {
    __logger.info('dbData: savedVoiceList(): ', userId)
    const doesSavedVoiceList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.savedVoiceList(), [userId, limit, page, userId])
      .then(result => {
        __logger.info('dbData: savedVoiceList(): then 1:', result[1])
        doesSavedVoiceList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error shared Voice List function: ', err)
        doesSavedVoiceList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSavedVoiceList.promise
  }

  receivedVoiceList (userId, limit, page) {
    __logger.info('dbData: receivedVoiceList(): ', userId)
    const doesReceivedVoiceList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.receivedVoiceList(), [userId, limit, page, userId])
      .then(result => {
        __logger.info('dbData: receivedVoiceList(): then 1:', result[1])
        doesReceivedVoiceList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error shared Voice List function: ', err)
        doesReceivedVoiceList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesReceivedVoiceList.promise
  }

  tagVoiceList (userId, limit, page) {
    __logger.info('dbData: tagVoiceList(): ', userId)
    const doestagVoiceList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.tagVoiceList(), [userId, limit, page, userId])
      .then(result => {
        __logger.info('dbData: tagVoiceList(): then 1:', result[1])
        doestagVoiceList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error tags Voice List function: ', err)
        doestagVoiceList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doestagVoiceList.promise
  }

  sharedVoice (voiceId, userId) {
    __logger.info('dbData: sharedVoice(): ')
    const doesSharedVoice = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.sharedVoice(), [voiceId, userId])
      .then(result => {
        __logger.info('dbData: sharedVoice(): then 1:', result)
        doesSharedVoice.resolve(result[0])
      })
      .catch(err => {
        __logger.error('dbData: error insert share voice function: ', err)
        doesSharedVoice.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSharedVoice.promise
  }

  sharedOperation (voiceId, sharedUserId, userId) {
    __logger.info('dbData: sharedOperation(): ')
    const doesSharedOperation = q.defer()
    this.insertSharedVoice(voiceId, sharedUserId, userId)
    this.sharedVoice(voiceId, userId)
    doesSharedOperation.resolve(true)
    return doesSharedOperation.promise
  }

  getPointList (userId, sortType, limit, offset) {
    __logger.info('dbData: voice :: getPointList(): ', userId)
    const filterValue = {
      [__constants.SORT_TYPE[0]]: 'v.created_on desc',
      [__constants.SORT_TYPE[1]]: 'v.voice_point ASC',
      [__constants.SORT_TYPE[2]]: 'v.voice_point desc'
    }
    const doesgetPointList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getVoicePointList(filterValue[sortType]), [userId, limit, offset])
      .then(result => {
        __logger.info('dbData:: voice :: getPointList(): then 1:', result[1])
        doesgetPointList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get voice point list function: ', err)
        doesgetPointList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesgetPointList.promise
  }

  viewList (voicesDetails, userId) {
    __logger.info('dbData: voices :: ViewList(): ', userId)
    const filterValue = voicesDetails.map(data => {
      return [data.voiceId, data.voiceOwnerId, data.voiceCategoryId, data.timeInSec, userId, 1]
    })
    const doesViewList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.viewList(), [filterValue])
      .then(result => {
        __logger.info('dbData: get voices ViewList(): then 1:', result[1])
        doesViewList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get voices view list function: ', err)
        doesViewList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesViewList.promise
  }
}

module.exports = Voices
