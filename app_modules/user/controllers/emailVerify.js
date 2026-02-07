const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')
const emailValidator = require('deep-email-validator')

const emailVerify = (req, res) => {
  __logger.info('Inside emailVerify', req.query.email)
  const userService = new UserService()
  emailValidator.validate(req.query.email)
    .then(data => {
      __logger.info('emailVerify function', data)
      if (data && data?.validators?.regex?.valid && data?.validators?.mx?.valid) {
        return userService.checkEmailExist(req.query.email)
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID, err: __constants.RESPONSE_MESSAGES.EMAIL_NOT_VALID.message })
      }
    })
    .then(data => {
      __logger.info('emailVerify function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.USER_EXIST, data })
    })
    .catch(err => {
      __logger.error('emailVerify function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = emailVerify
