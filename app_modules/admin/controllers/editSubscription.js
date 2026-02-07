const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const editSubscription = (req, res) => {
  __logger.info('Inside editSubscription')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.updateSubcription(req.body)
    .then(data => {
      return userService.checkByPlanId(req.body.planId, true)
    })
    .then(data => {
      if (data) {
        __logger.info('updateSubcription :: then 1')
        return userService.updateSubcription(req.body, userId)
      }
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'plan update successfully' })
    })
    .catch(err => {
      __logger.error('error: editSubscription function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = editSubscription
