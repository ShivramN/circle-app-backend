const UserService = require('../app_modules/user/services/dbData')
const __util = require('../lib/util')
const __constants = require('../config/constants')
const __logger = require('../lib/logger')

const userConfgiMiddleware = (req, res, next) => {
  const userId = req.user && req.user.userId ? req.user.userId : null
  if (!userId) return next()
  const userService = new UserService()
  userService.getUserDetails(userId)
    .then(userConfig => {
      req.userConfig = userConfig
      return next()
    })
    .catch(err => {
      __logger.info('err', err)
      __util.send(res, { type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
    })
}
module.exports = [userConfgiMiddleware]
