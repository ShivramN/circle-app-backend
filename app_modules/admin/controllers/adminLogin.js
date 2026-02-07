const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const passMgmt = require('../../../lib/util/password_mgmt')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const authMiddleware = require('../../../middlewares/auth/authentication')
const UserService = require('../services/dbData')

const controller = (req, res) => {
  __logger.info('Inside login')
  const validate = new ValidationService()
  const userService = new UserService()
  validate.login(req.body)
    .then(data => {
      __logger.info('Login :: controller :: Then 1', { data })
      return userService.getAdminDetails(req.body.email)
    })
    .then(data => {
      if (data && data.length > 0) {
        __logger.info('Login :: controller:: Then 2', { data })
        const hashPassword = passMgmt.create_hash_of_password(req.body.password, data[0].saltKey.toLowerCase())
        if (hashPassword.passwordHash !== data[0].hashPassword.toLowerCase()) { // todo : use bcrypt
          return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PWD_INVALID, err: __constants.RESPONSE_MESSAGES.PWD_INVALID.message })
        }
        const payload = { userId: data[0].userId, type: 'admin' }
        const token = authMiddleware.setTokenAdmin(payload, __constants.CUSTOM_CONSTANT.ADMIN_SESSION_TIME)
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { email: data[0].email, token: token } })
      } else {
        __util.send(res, { type: __constants.RESPONSE_MESSAGES.EMAIL_USERNAME_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.EMAIL_USERNAME_NOT_EXIST.message })
      }
    })
    .catch(err => {
      __logger.error('error: login function', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = controller
