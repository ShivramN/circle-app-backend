const ValidationService = require('../services/validation')
const VerificationService = require('../services/verification')
const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')

const resendOtp = (req, res) => {
  __logger.info('Inside resend OTP')
  const validate = new ValidationService()
  const verificationService = new VerificationService()
  const userService = new UserService()
  let userDetails
  validate.checkUserId(req.body)
    .then(data => {
      __logger.info('resendOtp function', data)
      return userService.getUserDataByUserId(data.userId)
    })
    .then(data => {
      userDetails = data[0]
      return userService.addVerificationCode(req.body.userId, __constants.VERIFICATION_CHANNEL.email.expiresIn, __constants.VERIFICATION_CHANNEL.email.codeLength)
    })
    .then(data => { return verificationService.sendVerificationCodeByEmail(data.code, userDetails.email) })
    .then(data => {
      __logger.info('resendOtp function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_VC, data: { userId: userDetails.userId } })
    })
    .catch(err => {
      __logger.error('resendOtp function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = resendOtp
