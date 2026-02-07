const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const addEvent = (req, res) => {
  __logger.info('inside addEvent :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const userCoin = req.userConfig && req.userConfig.coinRewards ? parseInt(req.userConfig.coinRewards) : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()

  validate.eventTemplate(req.body)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('addEvent function', data)
      if (data && data.addEvent) {
        return eventService.checkEventByAll(req.body, userId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      return req.body.languageId.length > 0 ? eventService.checkLanguageById(req.body.languageId, userId) : true
    })
    .then((data) => {
      if (userCoin < req.body.eventCoinPoint) {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.COIN_LIMIT, data: { inSufficient: true }, err: __constants.RESPONSE_MESSAGES.COIN_LIMIT.message })
      } else {
        __logger.info('addEvent :: then 1', data)
        return eventService.insertEvent(req.body, userId, req.userConfig.followingUserCount, req.userConfig.followerUserCount, data.languageId)
      }
    })
    .then(data => {
      __logger.info('addEvent function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { eventId: data } })
    })
    .catch(err => {
      __logger.error('addEvent function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: err.data || null, err: err.err })
    })
}

module.exports = addEvent
