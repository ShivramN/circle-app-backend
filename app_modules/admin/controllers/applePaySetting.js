const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const applePay = (req, res) => {
  __logger.info('Inside applePay')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const adminService = new Service()
  validate.updateApplePay(req.body)
    .then(data => {
      __logger.info('applePay :: then 1')
      return adminService.updateApplePay(req.body.appleIAPStatus, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'Updated successfully' })
    })
    .catch(err => {
      __logger.error('error: applePay function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = applePay
