const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')
const VerificationService = require('../services/verification')
const emailValidator = require('deep-email-validator')

const controllerSignUp = (req, res) => {
  __logger.info('Inside Sign up')
  const userService = new UserService()
  const verificationService = new VerificationService()
  let userId
  if (!req.body.email || req.body.email === '0') {
    return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, data: {}, err: ['please provide email ID of type string'] })
  }
  emailValidator.validate(req.body.email)
    .then(data => {
      __logger.info('controllerSignUp :: signUp function', data)
      if (data && data?.validators?.regex?.valid) {
        return userService.createUser(req.body.email, __constants.PROVIDER_TYPE.email)
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID, err: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID.message })
      }
    })
    .then(data => {
      userId = data.userId
      __logger.info('controllerSignUp :: signUp function :: User created', { userId })
      // Generate and send verification code via email
      return userService.addVerificationCode(userId, __constants.VERIFICATION_CHANNEL.email.expiresIn, __constants.VERIFICATION_CHANNEL.email.codeLength)
    })
    .then(data => {
      __logger.info('controllerSignUp :: Verification code generated', { code: data.code })
      return verificationService.sendVerificationCodeByEmail(data.code, req.body.email)
    })
    .then(data => {
      __logger.info('controllerSignUp :: Email sent successfully', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_VC, data: { userId, isVerified: 0, isUserExist: false } })
    })
    .catch(err => {
      __logger.error('controllerSignUp :: signUp function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: err.data, err: err.err })
    })
}

module.exports = controllerSignUp
