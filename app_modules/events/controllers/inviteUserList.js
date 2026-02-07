const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const inviteUserList = (req, res) => {
  __logger.info('inside inviteUserList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0

  const validate = new ValidationService()
  const eventService = new EventService()
  const planService = new PlanService()
  let limit = 0
  let page = 0

  validate.checkInviteUser(req.query)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('inviteUserList function', data)
      if (data && data.addEvent) {
        const searchField = req?.query?.searchField
        limit = req.query.limit ? parseInt(req.query.limit) : 100
        page = req.query.page ? parseInt(req.query.page) : 1
        const offset = limit * (page - 1)
        return eventService.getInviteList(userId, limit, offset, searchField)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      const pagination = { currentPage: page }
      __logger.info('inviteUserList function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data, pagination } })
    })
    .catch(err => {
      __logger.error('inviteUserList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = inviteUserList
