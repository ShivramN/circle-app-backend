const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const PlanService = require('../../subscription/services/dbData')
const Service = require('../services/dbData')

const applePayment = (req, res) => {
  __logger.info('inside applePayment :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new Validation()
  const planService = new PlanService()
  const service = new Service()

  validate.checkApplePay(req.body)
    .then((data) => {
      return planService.checkPlan(req.body.planId, true)
    })
    .then(async (data) => {
      const applePaymentDetails = await service.applePay(data, userId, req.body.transactionId)
      return applePaymentDetails
    })
    .then(data => {
      if (data) {
        __logger.info('applePayment function :: Then 1')
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'Added succesfully' })
      }
    })
    .catch(err => {
      __logger.error('applePayment function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = applePayment
