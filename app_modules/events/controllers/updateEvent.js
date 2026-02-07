const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const updateEvent = (req, res) => {
  __logger.info('inside updateEvent :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const userCoin = req.userConfig && req.userConfig.coinRewards ? parseInt(req.userConfig.coinRewards) : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()

  validate.eventUpdateTemplate(req.body)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('updateEvent function', data)
      if (data && data.addEvent) {
        return req.body.languageId.length > 0 ? eventService.checkLanguageById(req.body.languageId, userId) : true
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      __logger.info('updateEvent :: then 1', data)
      return eventService.checkUserEventById(req.body.eventId, userId)
    })
    .then(data => {
      if (data.eventCoinPoint >= req.body.eventCoinPoint) {
        return true
      }
      const difference = req.body.eventCoinPoint - data.eventCoinPoint
      if (userCoin < difference) {
        return rejectHandler({
          type: __constants.RESPONSE_MESSAGES.COIN_LIMIT,
          data: { inSufficient: true },
          err: __constants.RESPONSE_MESSAGES.COIN_LIMIT.message
        })
      }
      return eventService.updateRedemmed(difference, req.body.eventId, userId, __constants.MEDIA_TYPE[2], __constants.SUB_TYPE[1])
    })
    .then((data) => eventService.updateEvent(req.body, userId, req.userConfig.followingUserCount, req.userConfig.followerUserCount, data.languageId))
    .then(data => __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { eventId: data } }))
    .catch(err => {
      __logger.error('updateEvent function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: err.data || null, err: err.err })
    })
}

module.exports = updateEvent
