const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const __logger = require('../../../lib/logger')
const UserService = require('../../user/services/dbData')

class Events {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  getLanguage () {
    __logger.info('dbData: getLanguage(): ')
    const doesGetLanguage = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getLanguage(), '')
      .then(result => {
        __logger.info('dbData: getLanguage(): then 1:', result)
        if (result && result.length > 0) {
          doesGetLanguage.resolve(result)
        } else {
          doesGetLanguage.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get language function: ', err)
        doesGetLanguage.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetLanguage.promise
  }

  checkEventByAll (eventDetails, userId) {
    __logger.info('dbData: checkEventByAll(): ')
    const doesCheckEventByAll = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkEventByAll(), [eventDetails.eventTitle, JSON.stringify(eventDetails.eventThumbnail), eventDetails.eventAddress, eventDetails.languageId, eventDetails.eventMinAge, eventDetails.eventMaxAge, eventDetails.eventSeat, eventDetails.eventHostName, eventDetails.eventDescription, eventDetails.eventStartDate, eventDetails.eventEndDate, eventDetails.eventStartTime, eventDetails.eventEndTime, eventDetails.invitePeople, eventDetails.eventCoinPoint, JSON.stringify(eventDetails.eventMoreUrl), eventDetails.eventAddTerms, eventDetails.eventSpecialNote, userId, eventDetails.categoryId])
      .then(result => {
        __logger.info('dbData: checkEventByAll(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckEventByAll.reject({ type: __constants.RESPONSE_MESSAGES.EVENT_EXISTS, err: __constants.RESPONSE_MESSAGES.EVENT_EXISTS.message })
        } else {
          doesCheckEventByAll.resolve(false)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check event by all function: ', err)
        doesCheckEventByAll.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckEventByAll.promise
  }

  checkUserEventById (eventId, userId) {
    __logger.info('dbData: checkUserEventById(): ', eventId)
    const doesCheckUserEventById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUserEventById(), [eventId, userId])
      .then(result => {
        __logger.info('dbData: checkUserEventById(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckUserEventById.resolve(result[0])
        } else {
          doesCheckUserEventById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_EVENT, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_EVENT.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check user event by id function: ', err)
        doesCheckUserEventById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUserEventById.promise
  }

  insertPrivateMember (eventId, invitePeopleUserId, userId) {
    const insertArr = invitePeopleUserId.map(data => {
      const inviteId = this.uniqueId.uuid()
      return [inviteId, eventId, data, new Date(), userId, 1, 0]
    })
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.bulkInsert(), [insertArr])
      .then(result => {
        __logger.info('dbData: insertPrivateMember(): then 1:', result)
        return true
      })
      .catch(err => {
        __logger.error('dbData: error in insert private meember function: ', err)
      })
  }

  deleteInvitedPeople (eventId, invitePeopleUserId, userId) {
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteInvitedPeople(), [eventId, userId, 0])
      .then(result => {
        __logger.info('dbData: deleteInvitePeople(): then 1:', result)
        this.insertPrivateMember(eventId, invitePeopleUserId, userId)
        return true
      })
      .catch(err => {
        __logger.error('dbData: error in delete invite people function: ', err)
      })
  }

  updateEvent (eventDetails, userId, followingUserCount, followerUserCount, languageId) {
    __logger.info('dbData: updateEvent(): ')
    if (!eventDetails.invitePeopleCount) eventDetails.invitePeopleCount = eventDetails.invitePeople === __constants.EVENT_INVITE_TYPE[2] ? followerUserCount : followingUserCount
    const doesUpdateEvent = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateEvent(), [eventDetails.eventTitle, JSON.stringify(eventDetails.eventThumbnail), eventDetails.eventAddress, languageId, eventDetails.eventMinAge || 0, eventDetails.eventMaxAge || 0, eventDetails.eventSeat, eventDetails.eventHostName, eventDetails.eventDescription, eventDetails.eventStartDate, eventDetails.eventEndDate, eventDetails.eventStartTime, eventDetails.eventEndTime, eventDetails.invitePeople, eventDetails.invitePeopleCount, eventDetails.eventCoinPoint, JSON.stringify(eventDetails.eventMoreUrl), eventDetails.eventAddTerms, eventDetails.eventSpecialNote, eventDetails.categoryId, userId, eventDetails.isAgeCriteriaEnabled, eventDetails.eventId, userId])
      .then(result => {
        __logger.info('dbData: updateEvent(): then 1:', result)
        if (result && result.affectedRows > 0) {
          if (eventDetails.invitePeople === 'private') this.deleteInvitedPeople(eventDetails.eventId, eventDetails.invitePeopleUserId, userId)
          doesUpdateEvent.resolve(eventDetails.eventId)
        } else {
          doesUpdateEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update event by id function: ', err)
        doesUpdateEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateEvent.promise
  }

  insertEvent (eventDetails, userId, followingUserCount, followerUserCount, languageId) {
    __logger.info('dbData: insertEvent(): ', eventDetails)
    console.log('---------------', eventDetails.isAgeCriteriaEnabled)
    const doesInsertEvent = q.defer()
    const userService = new UserService()
    if (!eventDetails.invitePeopleCount) eventDetails.invitePeopleCount = eventDetails.invitePeople === __constants.EVENT_INVITE_TYPE[2] ? followerUserCount : followingUserCount
    const eventId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertEvent(), [eventId, eventDetails.eventTitle, eventDetails.eventStartDate, eventDetails.eventEndDate, eventDetails.eventStartTime, eventDetails.eventEndTime, eventDetails.eventAddress, languageId, eventDetails.eventMinAge || 0, eventDetails.eventMaxAge || 0, eventDetails.eventSeat, eventDetails.eventCoinPoint, eventDetails.eventDescription, eventDetails.eventHostName, eventDetails.invitePeople, eventDetails.invitePeopleCount, JSON.stringify(eventDetails.eventThumbnail), JSON.stringify(eventDetails.eventMoreUrl), eventDetails.eventAddTerms, eventDetails.eventSpecialNote, eventDetails.categoryId, userId, eventDetails.isAgeCriteriaEnabled, eventDetails.categoryId])
      .then(result => {
        __logger.info('dbData: insertEvent(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          this.coinRedemmed(eventDetails.eventCoinPoint, eventId, userId, __constants.MEDIA_TYPE[2], __constants.SUB_TYPE[1])
          userService.updateCount('event_count = event_count + 1', userId)
          if (eventDetails.invitePeople === 'private') this.insertPrivateMember(eventId, eventDetails.invitePeopleUserId, userId)
          doesInsertEvent.resolve(eventId)
        } else {
          doesInsertEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert event function: ', err)
        doesInsertEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertEvent.promise
  }

  checkUsersEventById (userId, limit, page) {
    __logger.info('dbData: checkUsersEventById(): ', userId)
    const limitsixty = (60 * limit) / 100
    const limitFourty = (40 * limit) / 100
    const offset = limitsixty * (page - 1)
    const offset1 = limitFourty * (page - 1)
    const doesCheckUsersEventById = q.defer()
    let finalResult = []
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkUsersEventById(), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, userId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], limitsixty, offset, __constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, userId, userId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], limitFourty, offset1])
      .then(result => {
        __logger.info('dbData: checkUsersEventById(): then 1:', result.length)
        if (result && (result[0].length > 0) && (result[1].length > 0)) {
          finalResult = result[1].reduce((acc, cur, ind, arr) => {
            if (!result[0].some(itemB => itemB.eventId === cur.eventId)) result[0].push(cur)
            if (ind === (arr.length - 1)) acc = result[0]
            return acc
          }, [])
        }
        doesCheckUsersEventById.resolve(finalResult)
      })
      .catch(err => {
        __logger.error('dbData: error in check user event by user id function: ', err)
        doesCheckUsersEventById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUsersEventById.promise
  }

  checkHalfEventById (userId, eventId) {
    __logger.info('dbData: checkHalfEventById(): ', userId, eventId)
    const doesCheckHalfEventById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkHalfEventById(), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, userId, userId, eventId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], userId])
      .then(result => {
        __logger.info('dbData: checkHalfEventById(): then 1:', result.length)
        doesCheckHalfEventById.resolve(result[0])
      })
      .catch(err => {
        __logger.error('dbData: error in check half event by id function: ', err)
        doesCheckHalfEventById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckHalfEventById.promise
  }

  checkFollowedEvent (followerId, userId, limit, offset, filterEvent) {
    __logger.info('dbData: checkFollowedEvent(): ')
    const doesCheckFollowedEvent = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkFollowedEvent(filterEvent), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, userId, followerId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], limit, offset, __constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, followerId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3]])
      .then(result => {
        __logger.info('dbData: checkFollowedEvent(): then 1:', result[1][0].totalEvents)
        doesCheckFollowedEvent.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in check followed event function: ', err)
        doesCheckFollowedEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckFollowedEvent.promise
  }

  checkEventById (eventId, userId) {
    __logger.info('dbData: checkEventById(): ')
    const doesCheckEventById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkEventById(), [userId, userId, userId, eventId, userId])
      .then(result => {
        __logger.info('dbData: checkEventById(): then 1:')
        if (result && result[0].length > 0 && result[1].length > 0) {
          result[0][0].languageName = result[0][0].languageId.reduce((acc, current) => {
            const language = result[1].find(lang => lang.languageId === current)
            if (language !== undefined) acc.push(language)
            return acc
          }, [])
          delete result[0][0].languageId
          doesCheckEventById.resolve(result[0][0])
        } else {
          doesCheckEventById.reject({ type: __constants.RESPONSE_MESSAGES.NOT_BUY_EVENT, err: __constants.RESPONSE_MESSAGES.NOT_BUY_EVENT.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check event by id function: ', err)
        doesCheckEventById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckEventById.promise
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
        __logger.error('dbData: error in check category wise by id function: ', err)
        doesCheckCategoryWise.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckCategoryWise.promise
  }

  async checkSuggestEvent (categoryIdList, userId, limit, offset, categoryId = null) {
    __logger.info('dbData: checkSuggestEvent(): ', categoryIdList, userId)
    const doesCheckSuggestEvent = q.defer()
    // const value = categoryId ?? await this.checkCategoryWise(categoryIdList, userId)
    const value = categoryId ?? categoryIdList
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkSuggestEvent(), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, userId, value, userId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], limit, offset])
      .then(result => {
        if (result) {
          __logger.info('dbData: checkSuggestEvent(): then 1:', result.length)
          doesCheckSuggestEvent.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check event by id function: ', err)
        doesCheckSuggestEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckSuggestEvent.promise
  }

  deleteEventByID (eventId, userId, categoryId) {
    __logger.info('dbData: deleteEventByID(): ')
    const doesDeleteEventByID = q.defer()
    const userService = new UserService()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteEventByID(), [false, eventId, userId, categoryId])
      .then(result => {
        __logger.info('dbData: deleteEventByID(): then 1:', result)
        if (result && result[0].affectedRows > 0 && result[1].affectedRows > 0) {
          userService.updateCount('event_count = event_count - 1', userId)
          doesDeleteEventByID.resolve(result[0])
        } else {
          doesDeleteEventByID.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_EVENT, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_EVENT.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check delete by id function: ', err)
        doesDeleteEventByID.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteEventByID.promise
  }

  getInviteList (userId, limit, offset, searchField) {
    __logger.info('dbData: getInviteList(): ', userId, limit, offset)
    const doesGetInviteList = q.defer()
    const value = searchField ? [userId, userId, `%${searchField}%`, limit, offset] : [userId, userId, limit, offset]

    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getInviteList(searchField), value)
      .then(result => {
        __logger.info('dbData: getInviteList(): then 1:', result)
        doesGetInviteList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get invite list function: ', err)
        doesGetInviteList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetInviteList.promise
  }

  storeEvent (eventId, userId) {
    __logger.info('dbData: storeEvent(): ')
    const doesStoreEvent = q.defer()
    const saveEventId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.storeEvent(), [saveEventId, eventId, userId])
      .then(result => {
        __logger.info('dbData: storeEvent(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesStoreEvent.resolve(result[0])
        } else {
          doesStoreEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error insert event store function: ', err)
        doesStoreEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesStoreEvent.promise
  }

  checkEventSaved (eventId, userId) {
    __logger.info('dbData: checkEventSaved(): ')
    const doesCheckEventSaved = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkEventSaved(), [eventId, userId])
      .then(result => {
        __logger.info('dbData: checkEventSaved(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckEventSaved.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_SAVED_EVENT, err: __constants.RESPONSE_MESSAGES.ALREADY_SAVED_EVENT.message })
        } else {
          doesCheckEventSaved.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error check event store function: ', err)
        doesCheckEventSaved.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckEventSaved.promise
  }

  checkEventShared (eventId, sharedUserId, userId) {
    __logger.info('dbData: checkEventShared(): ')
    const doesCheckEventShared = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkEventShared(), [eventId, userId, sharedUserId])
      .then(result => {
        __logger.info('dbData: checkEventShared(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckEventShared.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_SHARED_EVENT, err: __constants.RESPONSE_MESSAGES.ALREADY_SHARED_EVENT.message })
        } else {
          doesCheckEventShared.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error check event store function: ', err)
        doesCheckEventShared.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckEventShared.promise
  }

  insertSharedEvent (eventId, sharedUserId, userId) {
    __logger.info('dbData: insertSharedEvent(): ', sharedUserId)
    const doesInsertSharedEvent = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertSharedEvent(), [this.uniqueId.uuid(), sharedUserId, eventId, userId])
      .then(result => {
        __logger.info('dbData: insertSharedEvent(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesInsertSharedEvent.resolve(result[0])
        } else {
          doesInsertSharedEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error insert event store function: ', err)
        doesInsertSharedEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertSharedEvent.promise
  }

  sharedEvent (eventId, userId) {
    __logger.info('dbData: sharedEvent(): ')
    const doesSharedEvent = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.sharedEvent(), [eventId, userId])
      .then(result => {
        __logger.info('dbData: sharedEvent(): then 1:', result)
        doesSharedEvent.resolve(result[0])
      })
      .catch(err => {
        __logger.error('dbData: error insert share event function: ', err)
        doesSharedEvent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSharedEvent.promise
  }

  sharedOperation (eventId, sharedUserId, userId) {
    __logger.info('dbData: sharedOperation(): ')
    const doesSharedOperation = q.defer()
    this.insertSharedEvent(eventId, sharedUserId, userId)
    this.sharedEvent(eventId, userId)
    doesSharedOperation.resolve(true)
    return doesSharedOperation.promise
  }

  createdEventList (userId, limit, page, filterEvent) {
    __logger.info('dbData: createdEventList(): ', userId)
    const doesCreatedEventList = q.defer()

    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.createdEventList(filterEvent), [userId, limit, page, userId])
      .then(result => {
        __logger.info('dbData: createdEventList(): then 1:', result[1])
        doesCreatedEventList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error created Event List function: ', err)
        doesCreatedEventList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCreatedEventList.promise
  }

  savedEventList (userId, limit, page, filterEvent) {
    __logger.info('dbData: savedEventList(): ', userId)
    const doesSavedEventList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.savedEventList(filterEvent), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], limit, page, userId])
      .then(result => {
        __logger.info('dbData: savedEventList(): then 1:', result[1])
        doesSavedEventList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error shared Event List function: ', err)
        doesSavedEventList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSavedEventList.promise
  }

  receivedEventList (userId, limit, page, filterEvent) {
    __logger.info('dbData: receivedEventList(): ', userId)
    const doesReceivedEventList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.receivedEventList(filterEvent), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3], limit, page, userId])
      .then(result => {
        __logger.info('dbData: receivedEventList(): then 1:', result[1])
        doesReceivedEventList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error shared Event List function: ', err)
        doesReceivedEventList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesReceivedEventList.promise
  }

  updateEventBuy (eventId, userId) {
    __logger.info('dbData: updateEventBuy(): ', userId)
    const doesUpdateEventBuy = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateEventBuy(), [userId, eventId, userId])
      .then(result => {
        __logger.info('dbData: updateEventBuy(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateEventBuy.resolve(result)
        } else {
          doesUpdateEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error update Event buy function: ', err)
        doesUpdateEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateEventBuy.promise
  }

  checkEventBuy (eventId, userId) {
    __logger.info('dbData: checkEventBuy(): ', userId)
    const doesCheckEventBuy = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkEventBuy(), [__constants.EVENT_INVITE_TYPE[0], userId, __constants.EVENT_INVITE_TYPE[1], userId, __constants.EVENT_INVITE_TYPE[2], userId, __constants.EVENT_INVITE_TYPE[3], userId, userId, eventId, __constants.EVENT_INVITE_TYPE[0], __constants.EVENT_INVITE_TYPE[1], __constants.EVENT_INVITE_TYPE[2], __constants.EVENT_INVITE_TYPE[3]])
      .then(result => {
        __logger.info('dbData: checkEventBuy(): then 1:', result[0])
        if (result && (result.length > 0) && !result[0].isExpire && (result[0].canBuy || (result[0].eventSeat === 0))) {
          result[0].isBought ? doesCheckEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.ALREADY_BUY_EVENT, err: __constants.RESPONSE_MESSAGES.ALREADY_BUY_EVENT.message }) : doesCheckEventBuy.resolve(result[0])
        } else {
          result?.[0]?.isExpire ? doesCheckEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.EVENT_EXPIRED, err: __constants.RESPONSE_MESSAGES.EVENT_EXPIRED.message }) : result?.[0]?.canBuy && result[0].eventSeat !== 0 ? doesCheckEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.SEAT_FULL, err: __constants.RESPONSE_MESSAGES.SEAT_FULL.message }) : doesCheckEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.NO_RIGHT, err: __constants.RESPONSE_MESSAGES.NO_RIGHT.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error check Event buy function: ', err)
        doesCheckEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckEventBuy.promise
  }

  getPointList (userId, sortType, limit, offset) {
    __logger.info('dbData: event :: getPointList(): ', userId)
    const filterValue = {
      [__constants.SORT_TYPE[0]]: 'e.created_on desc',
      [__constants.SORT_TYPE[1]]: 'e.event_point ASC',
      [__constants.SORT_TYPE[2]]: 'e.event_point desc'
    }
    const doesgetPointList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getEventPointList(filterValue[sortType]), [userId, limit, offset])
      .then(result => {
        __logger.info('dbData: event ::  getPointList(): then 1:', result[1])
        doesgetPointList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get event point list function: ', err)
        doesgetPointList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesgetPointList.promise
  }

  addEventBuy (eventId, userId, eventOwner) {
    __logger.info('dbData: addEventBuy(): ', userId)
    const doesAddEventBuy = q.defer()
    const inviteId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.singleInsert(), [inviteId, eventId, userId, eventOwner, 1, eventOwner])
      .then(result => {
        __logger.info('dbData: addEventBuy(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesAddEventBuy.resolve(result)
        } else {
          doesAddEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error update Event buy function: ', err)
        doesAddEventBuy.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesAddEventBuy.promise
  }

  getLanguageName (eventDetails) {
    __logger.info('dbData: getLanguageName(): ')
    const doesGetLanguageName = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getLanguage(), '')
      .then(result => {
        __logger.info('dbData: getLanguageName(): then 1:', result)
        if (result && result.length > 0) {
          eventDetails[0].map(event => {
            event.languageName = event.languageId.reduce((acc, languageId) => {
              const language = result.find(lang => lang.languageId === languageId)
              if (language !== undefined) acc.push(language)
              return acc
            }, [])
            delete event.languageId
          })
          doesGetLanguageName.resolve(eventDetails)
        } else {
          doesGetLanguageName.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get language function: ', err)
        doesGetLanguageName.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetLanguageName.promise
  }

  boughtEventList (userId, limit, page, filterEvent) {
    __logger.info('dbData: boughtEventList(): ', userId)
    const doesBoughtEventList = q.defer()

    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.boughtEventList(filterEvent), [userId, limit, page, userId])
      .then(result => {
        __logger.info('dbData: boughtEventList(): then 1:', result[1])
        doesBoughtEventList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error bought Event List function: ', err)
        doesBoughtEventList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesBoughtEventList.promise
  }

  checkLanguageById (languageId) {
    __logger.info('dbData: checkLanguageById(): ')
    const doesCheckLanguageById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getLanguageById(), [languageId])
      .then(result => {
        __logger.info('dbData: checkLanguageById(): then 1:', result)
        if (result && result[0] && result[0].languageId !== null) {
          doesCheckLanguageById.resolve(result[0])
        } else {
          doesCheckLanguageById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_LANGUAGE, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_LANGUAGE.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get language function: ', err)
        doesCheckLanguageById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckLanguageById.promise
  }

  viewList (eventDetails, userId) {
    __logger.info('dbData: event :: ViewList(): ', userId)
    const filterValue = eventDetails.map(data => {
      return [data.eventId, data.eventOwnerId, data.eventCategoryId, data.timeInSec, userId, 1]
    })
    const doesViewList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.viewList(), [filterValue])
      .then(result => {
        __logger.info('dbData: get event ViewList(): then 1:', result[1])
        doesViewList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get event view list function: ', err)
        doesViewList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesViewList.promise
  }

  coinRedemmed (coin, eventId, userId, mediaType, subType) {
    __logger.info('dbData: coinRedemmed(): ', userId)
    const userService = new UserService()
    const doesCoinRedemmed = q.defer()
    userService.detectCoin(coin, userId)
      .then(data => {
        return __db.mysql.query(__constants.MYSQL_NAME, queryProvider.coinRedemmed(), [this.uniqueId.uuid(), mediaType, eventId, userId, coin, subType, eventId])
      })
      .then(result => {
        __logger.info('dbData: coinRedemmed(): then 1:', result)
        if (result && result[0] && result[0].affectedRows > 0) {
          doesCoinRedemmed.resolve(result)
        } else {
          doesCoinRedemmed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error update Event buy function: ', err)
        doesCoinRedemmed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCoinRedemmed.promise
  }

  updateRedemmed (coin, eventId, userId, mediaType, subType) {
    __logger.info('dbData: updateRedemmed(): ', userId)
    const userService = new UserService()
    const doesUpdateRedemmed = q.defer()
    userService.detectCoin(coin, userId)
      .then(data => {
        return __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateRedemmed(), [coin, eventId, userId, mediaType, subType])
      })
      .then(result => {
        __logger.info('dbData: updateRedemmed(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateRedemmed.resolve(result)
        } else {
          doesUpdateRedemmed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error update Event buy function: ', err)
        doesUpdateRedemmed.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateRedemmed.promise
  }

  checkEventCanBuy (eventId, sharedUserId, userId) {
    __logger.info('dbData: checkEventCanBuy(): ')
    const doesCheckEventCanBuy = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkEventCanBuy(), [__constants.EVENT_INVITE_TYPE[0], sharedUserId, __constants.EVENT_INVITE_TYPE[1], sharedUserId, __constants.EVENT_INVITE_TYPE[2], sharedUserId, __constants.EVENT_INVITE_TYPE[3], sharedUserId, eventId])
      .then(result => {
        __logger.info('dbData: checkEventCanBuy(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckEventCanBuy.resolve(this.sharedOperation(eventId, sharedUserId, userId))
        } else {
          doesCheckEventCanBuy.reject({ type: __constants.RESPONSE_MESSAGES.NotShare, err: __constants.RESPONSE_MESSAGES.NotShare.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error check Event buy function: ', err)
        doesCheckEventCanBuy.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckEventCanBuy.promise
  }

  getRedeemList (userId, sortType, limit, offset, subType) {
    __logger.info('dbData: event :: getRedeemList(): ', userId)
    const doesGetRedeemList = q.defer()
    const filterValue = {
      [__constants.SORT_TYPE[0]]: 'crh.created_on desc',
      [__constants.SORT_TYPE[1]]: 'crh.coin_spend ASC',
      [__constants.SORT_TYPE[2]]: 'crh.coin_spend desc'
    }
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.coinRedeemList(filterValue[sortType]), [userId, subType, __constants.MEDIA_TYPE[2], limit, offset])
      .then(result => {
        __logger.info('dbData: event ::  getRedeemList(): then 1:', result)
        doesGetRedeemList.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get event redeem list function: ', err)
        doesGetRedeemList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetRedeemList.promise
  }

  getBuyListUser (eventId) {
    __logger.info('dbData: event :: getBuyListUser(): ', eventId)
    const doesGetBuyListUser = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserBuyEvent(), [eventId])
      .then(result => {
        __logger.info('dbData: event ::  getBuyListUser(): then 1:', result)
        doesGetBuyListUser.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error get event redeem list function: ', err)
        doesGetBuyListUser.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetBuyListUser.promise
  }
}

module.exports = Events
