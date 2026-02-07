const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const savedNews = (req, res) => {
  __logger.info('inside savedNews :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const newsService = new NewsService()
  const planService = new PlanService()

  validate.checkNewsId(req.body)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      if (data && data.viewNews) {
        return newsService.checkNewsSaved(req.body.newsId, userId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then(data => {
      __logger.info('savedNews function', data)
      return newsService.storeNews(req.body.newsId, userId)
    })
    .then(data => {
      __logger.info('savedNews function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'Saved successfully' })
    })
    .catch(err => {
      __logger.error('savedNews function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = savedNews
