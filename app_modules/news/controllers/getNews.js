const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getNews = (req, res) => {
  __logger.info('inside getNews :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const newsService = new NewsService()
  const planService = new PlanService()
  let limit = 0
  let page = 0

  validate.checkPagination(req.query)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('getNews function', data)
      if (data && data.viewNews) {
        limit = req.query.limit >= '5' ? parseInt(req.query.limit) : 10
        page = req.query.page ? parseInt(req.query.page) : 1
        const offset = limit * (page - 1)
        return newsService.checkUsersNewsById(userId, limit, offset)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      const pagination = { currentPage: page }
      __logger.info('getNews function :: Then 1', { pagination })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data, pagination } })
    })
    .catch(err => {
      __logger.error('getNews function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getNews
