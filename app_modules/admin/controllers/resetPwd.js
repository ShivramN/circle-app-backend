const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const passMgmt = require('../../../lib/util/password_mgmt')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')

const controller = (req, res) => {
  __logger.info('Inside login')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new UserService()
  validate.resetPwd(req.body)
    .then(data => {
      __logger.info('Login :: controller :: Then 1', { data })
      return userService.getAdminDetailsById(userId)
    })
    .then(data => {
      __logger.info('Login :: controller:: Then 2', { data })
      const hashPassword = passMgmt.create_hash_of_password(req.body.oldPassword, data[0].saltKey.toLowerCase())
      if (hashPassword.passwordHash !== data[0].hashPassword.toLowerCase()) { // todo : use bcrypt
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PWD_INVALID, err: __constants.RESPONSE_MESSAGES.PWD_INVALID.message })
      }
      const newPwd = passMgmt.create_hash_of_password(req.body.newPassword, data[0].saltKey.toLowerCase())
      return userService.updatePassword(newPwd.passwordHash, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'password updated successfully' })
    })
    .catch(err => {
      __logger.error('error: login function', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = controller
