const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const authMiddleware = require('../../../middlewares/auth/authentication')
const UserService = require('../services/dbData')

const controller = (req, res) => {
  __logger.info('Inside SocialLogin')
  const validate = new ValidationService()
  const userService = new UserService()
  validate.socialLogin(req.body)
    .then(data => {
      __logger.info('SocialLogin :: controller :: Then 1', { data })
      return userService.socialLogin(req.body.email, req.body.type, req.body.socialToken)
    })
    .then(data => {
      if (data && data.isExist) {
        __logger.info('SocialLogin :: controller:: Then 2', { data })
        const payload = { userId: data.userId, signupType: req.body.socialToken }
        const token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.SESSION_TIME)
        data.token = token
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data } })
      } else {
        __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { data } })
      }
    })
    .catch(err => {
      __logger.error('error: SocialLogin function', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = controller
