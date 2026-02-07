const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getBuyList = (req, res) => {
  __logger.info('inside getBuyList :: ')
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()

  validate.checkEventId(req.query)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('getBuyList function', data)
      if (data && data.viewEvent) {
        return eventService.getBuyListUser(req.query.eventId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      __logger.info('getBuyList function :: Then 1')
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data } })
    })
    .catch(err => {
      __logger.error('getBuyList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getBuyList
