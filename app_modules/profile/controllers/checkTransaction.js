const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')
const checkDays = require('../../../lib/util/checkTime')

const checkTransaction = (req, res) => {
  __logger.info('Inside checkTransaction')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const service = new Service()
  service.checkTransaction(userId)
    .then(data => {
      data.planValidDays = (data.planValidDays > checkDays(data.buyedDate)) ? (data.planValidDays - checkDays(data.buyedDate)) : 0
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('error in checkTransaction function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = checkTransaction
