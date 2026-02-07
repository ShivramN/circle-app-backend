const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const getUserBasedNews = (req, res) => {
  __logger.info('inside getUserBasedNews :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const newsService = new NewsService()
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
      __logger.info('getUserBasedNews function', data)
      if (data && data.viewNews) {
        limit = req.query.limit ? parseInt(req.query.limit) : 100
        page = req.query.page ? parseInt(req.query.page) : 1
        const offset = limit * (page - 1)
        return newsService.checkFollowedNews(req.query.followerId, userId, limit, offset)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      __logger.info('getUserBasedNews function :: Then 2', data[1][0].totalNews)
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalNews: data[1][0].totalNews, newsList: data[0] } })
    })
    .catch(err => {
      __logger.error('getUserBasedNews function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserBasedNews
