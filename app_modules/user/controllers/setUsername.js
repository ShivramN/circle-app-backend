const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')
const authMiddleware = require('../../../middlewares/auth/authentication')

const setUsername = (req, res) => {
  __logger.info('Inside setUsername')
  const validate = new ValidationService()
  const userService = new UserService()
  const subscriptionId = 'basic'
  validate.setUser(req.body)
    .then(data => {
      __logger.info('setUsername function', data)
      return userService.checkUserDetails(req.body.username)
    })
    .then(data => { return userService.checkUserVerified(req.body.userId) })
    .then(data => {
      if (data.signupType !== __constants.SOCIAL_LOGIN_TYPE[3]) return userService.setPassword(req.body.userId)
      return (data.signupType === __constants.SOCIAL_LOGIN_TYPE[3]) && req.body.password ? userService.setPassword(req.body.userId, req.body.password) : rejectHandler({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Please provide password' })
    })
    .then(data => { return userService.setUserdetails(req.body.userId, req.body.username, req.body.fullName, __constants.SUBSCRIPTION[subscriptionId], req.body.gender, req.body.dateOfBirth) })
    .then(data => {
      __logger.info('setUsername function :: Then 1', { data })
      const payload = { userId: req.body.userId, signupType: req.body.signupType, subscriptionId: __constants.SUBSCRIPTION[subscriptionId] }
      const token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.SESSION_TIME)
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { token: token } })
    })
    .catch(err => {
      __logger.error('setUsername function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = setUsername
