const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')

const getUserDetailsList = (req, res) => {
  __logger.info('Inside getUserDetailsList')
  const validation = new Validation()
  const service = new Service()
  let limit = 0
  let page = 0
  validation.pagination(req.query)
    .then(data => {
      limit = req.query.limit ? parseInt(req.query.limit) : 10
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return service.getUserList(limit, offset)
    })
    .then(data => {
      const pagination = { totalCount: Math.ceil(data[1][0].totalCount / limit), currentPage: page }
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data: data[0], pagination } })
    })
    .catch(err => {
      __logger.error('error in getUserDetailsList function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserDetailsList
