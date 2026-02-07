const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getSuggestedEvent = (req, res) => {
  __logger.info('inside getSuggestedEvent :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const categoryId = req.userConfig && req.userConfig.categoryId.length > 0 ? req.userConfig.categoryId : ['']
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0

  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()
  let limit = 0
  let page = 0

  validate.checkPagination(req.query)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('getSuggestedEvent function', data)
      if (data && data.viewEvent) {
        limit = req.query.limit ? parseInt(req.query.limit) : 100
        page = req.query.page ? parseInt(req.query.page) : 1
        const offset = limit * (page - 1)
        return eventService.checkSuggestEvent(categoryId, userId, limit, offset, req.query?.categoryId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      const pagination = { currentPage: page }
      __logger.info('getSuggestedEvent function :: Then 2', { pagination })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data, pagination } })
    })
    .catch(err => {
      __logger.error('getSuggestedEvent function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getSuggestedEvent
