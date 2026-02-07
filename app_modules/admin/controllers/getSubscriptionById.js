const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const getSubscriptionById = (req, res) => {
  __logger.info('Inside getSubscriptionById')
  const validate = new ValidationService()
  const userService = new Service()
  validate.planId(req.params)
    .then(data => {
      return userService.checkByPlanId(req.params.planId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data[0] })
    })
    .catch(err => {
      __logger.error('error: getSubscriptionById function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getSubscriptionById
