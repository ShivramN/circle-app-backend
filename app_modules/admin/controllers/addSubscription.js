const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const addSubscription = (req, res) => {
  __logger.info('Inside addSubscription')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.addSubcription(req.body)
    .then(data => {
      return userService.checkSubcription(req.body)
    })
    .then(data => {
      __logger.info('addCategory :: then 1')
      return userService.insertPlan(req.body, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'add sucription successfully' })
    })
    .catch(err => {
      __logger.error('error: addSubscription function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = addSubscription
