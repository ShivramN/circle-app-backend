const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const NewsService = require('../services/dbData')

const getCreatedNewsList = (req, res) => {
  __logger.info('inside getCreatedNewsList :: ')
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
      return newsService.createdNewsList(userId, limit, offset)
    })
    .then(data => {
      __logger.info('getCreatedNewsList function :: Then 2', { data: data[1][0].totalNews })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalNews: data[1][0].totalCreatedNews || 0, newsList: data[0] } })
    })
    .catch(err => {
      __logger.error('getCreatedNewsList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getCreatedNewsList
