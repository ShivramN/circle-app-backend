const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')
const ValidationService = require('../services/validation')
const passMgmt = require('../../../lib/util/password_mgmt')

const changePassword = (req, res) => {
  const userService = new UserService()
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  __logger.info('Inside change password called: ', req.body)
  validate.changePassword(req.body)
    .then(data => {
      __logger.info('changePassword function', data)
      return userService.getUserDataByUserId(userId, true)
    })
    .then(data => {
      const hashPassword = passMgmt.create_hash_of_password(req.body.oldPassword, data[0].saltKey.toLowerCase())
      if (hashPassword.passwordHash !== data[0].hashPassword.toLowerCase()) { // todo : use bcrypt
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PWD_INVALID, err: __constants.RESPONSE_MESSAGES.PWD_INVALID.message })
      }
      return userService.updatePwd(userId, req.body.newPassword, data[0].saltKey)
    })
    .then(data => __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} }))
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
    })
}

module.exports = changePassword
