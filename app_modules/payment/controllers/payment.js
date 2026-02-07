const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const PlanService = require('../../subscription/services/dbData')
const Service = require('../services/dbData')

const payment = (req, res) => {
  __logger.info('inside payment :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new Validation()
  const planService = new PlanService()
  const service = new Service()

  validate.validation(req.body)
    .then((data) => {
      return planService.checkPlan(req.body.planId, true)
    })
    .then(async (data) => {
      const paymentDetails = await service.stripeFunction(data, userId, req.userConfig.fullName, req.userConfig.email)
      return paymentDetails
    })
    .then(data => {
      __logger.info('payment function :: Then 1')
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('payment function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = payment
