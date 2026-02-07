const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const addNews = (req, res) => {
  __logger.info('inside addNews :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const newsService = new NewsService()
  const planService = new PlanService()

  validate.newsTemplate(req.body)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('addNews function', data)
      if (data && data.addNews) {
        return newsService.checkNewsByAll(req.body, userId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then((data) => {
      __logger.info('addNews :: then 1', data)
      return newsService.insertNews(req.body, userId)
    })
    .then(data => {
      __logger.info('addNews function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { newsId: data } })
    })
    .catch(err => {
      __logger.error('addNews function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = addNews
