const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const deleteSubscription = (req, res) => {
  __logger.info('Inside deleteSubscription')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.deActive(req.params)
    .then(data => {
      return userService.checkByPlanId(req.params.planId, true)
    })
    .then(data => {
      __logger.info('deleteSubscription :: then 1')
      return userService.deletePlan(req.params.planId, req.params.isActive, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'updated plan successfully' })
    })
    .catch(err => {
      __logger.error('error: deleteSubscription function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = deleteSubscription
