const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const ValidationService = require('../services/validation')
const UserService = require('../services/dbData')
const authMiddleware = require('../../../middlewares/auth/authentication')

const otp = (req, res) => {
  __logger.info('otp ::>>>>>>..')
  const validatonService = new ValidationService()
  const userService = new UserService()
  let token
  validatonService.checkOtp(req.body)
    .then(data => {
      __logger.info('otp :: data::>>>>>>.. then 1', data)
      return userService.getOtpCode(data.userId, data.code)
    })
    .then(data => {
      __logger.info('otp :: data::>>>>>>.. then 2', data)
      return userService.updateotpVerifed(data.userId, data.isProfileCompleted)
    })
    .then(data => {
      if (!data.needUserInfo) {
        const payload = { userId: data.userId, signupType: __constants.SOCIAL_LOGIN_TYPE[3] }
        token = authMiddleware.setToken(payload, __constants.CUSTOM_CONSTANT.SESSION_TIME)
      }
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { isValidOTP: true, userId: req.body.userId, needUserInfo: data.needUserInfo, token } })
    })
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = otp
