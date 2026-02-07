const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const Service = require('../services/dbData')

const getList = (req, res) => {
  __logger.info('inside getList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new Validation()
  const service = new Service()
  let limit = 0
  let page = 0
  validate.pagination(req.query)
    .then((data) => {
      limit = req.query.limit ? parseInt(req.query.limit) : 100
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return service.getList(limit, offset, userId)
    })
    .then(data => {
      __logger.info('getList function :: Then 1')
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('getList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getList
