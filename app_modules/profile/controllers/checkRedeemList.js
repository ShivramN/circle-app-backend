const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const EventService = require('../../events/services/dbData')
const __util = require('../../../lib/util')

const checkRedeemList = (req, res) => {
  __logger.info('Inside checkRedeemList')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validation = new Validation()
  const service = new EventService()
  let limit = 0
  let page = 0
  validation.filterRedeem(req.query)
    .then(data => {
      limit = req.query.limit ? parseInt(req.query.limit) : 10
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return service.getRedeemList(userId, data.sortType, limit, offset, data.subType)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data })
    })
    .catch(err => {
      __logger.error('error in check redeem list function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = checkRedeemList
