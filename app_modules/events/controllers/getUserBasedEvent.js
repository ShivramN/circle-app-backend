const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getUserBasedEvent = (req, res) => {
  __logger.info('inside getUserBasedEvent :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()
  let limit = 0
  let page = 0

  validate.checkFollowerId(req.query)
    .then(data => {
      if (req.query.followerId === userId) {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.NOT_USERID, err: __constants.RESPONSE_MESSAGES.NOT_USERID.message })
      } else {
        return planService.checkPlan(planId)
      }
    })
    .then(data => {
      __logger.info('getUserBasedEvent function', data)
      if (data && data.viewEvent) {
        limit = req.query.limit ? parseInt(req.query.limit) : 100
        page = req.query.page ? parseInt(req.query.page) : 1
        const offset = limit * (page - 1)
        return eventService.checkFollowedEvent(req.query.followerId, userId, limit, offset, req.query.filterEvent)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      __logger.info('getUserBasedEvent function :: Then 2', { data: data[1][0] })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalEvents: data[1][0].totalEvents, eventList: data[0] } })
    })
    .catch(err => {
      __logger.error('getUserBasedEvent function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserBasedEvent
