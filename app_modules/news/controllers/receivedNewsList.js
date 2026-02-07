const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')

const receivedNewsList = (req, res) => {
  __logger.info('inside receivedNewsList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const newsService = new NewsService()
  let limit = 0
  let page = 0

  validate.valPagination(req.query)
    .then((data) => {
      limit = req.query.limit ? parseInt(req.query.limit) : 100
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return newsService.receivedNewsList(userId, limit, offset)
    })
    .then(data => {
      __logger.info('receivedNewsList function :: Then 2', { data: data[1][0].totalNews })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalNews: data[1][0].totalSharedNews || 0, newsList: data[0] } })
    })
    .catch(err => {
      __logger.error('receivedNewsList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = receivedNewsList
