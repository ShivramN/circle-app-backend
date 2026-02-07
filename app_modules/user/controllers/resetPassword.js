const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')
const ValidationService = require('../services/validation')

const resetPassword = (req, res) => {
  const userService = new UserService()
  const validate = new ValidationService()
  __logger.info('Inside reset password called: ', req.body)
  let userDetails
  validate.resetPassword(req.body)
    .then(data => {
      __logger.info('resetPassword function', data)
      return userService.getUserDataByUserId(data.userId, true)
    })
    .then(data => {
      userDetails = data[0]
      __logger.info('verify otp :: data::>>>>>>.. then 1', userDetails)
      return userService.getOtpCode(userDetails.userId, req.body.code)
    })
    .then(data => {
      return userService.deleteOtp(data.userId)
    })
    .then(data => {
      return userService.updatePwd(userDetails.userId, req.body.newPassword, userDetails.saltKey)
    })
    .then(() => __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} }))
    .catch(err => {
      __logger.error('resetPassword function error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
    })
}

module.exports = resetPassword
