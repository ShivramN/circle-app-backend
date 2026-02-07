const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getEventHalfDetail = (req, res) => {
  __logger.info('inside getEventHalfDetail :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()

  validate.checkEventId(req.query)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('getEventHalfDetail function', data)
      if (data && data.viewEvent) {
        return eventService.checkHalfEventById(userId, req.query.eventId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      __logger.info('getEventHalfDetail function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('getEventHalfDetail function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getEventHalfDetail
