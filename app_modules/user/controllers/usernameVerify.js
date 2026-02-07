const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')

const usernameVerify = (req, res) => {
  __logger.info('Inside usernameVerify')
  const validate = new ValidationService()
  const userService = new UserService()
  validate.checkUserName(req.query)
    .then(data => {
      __logger.info('usernameVerify function', data)
      return userService.checkUsernameExist(req.query.username)
    })
    .then(data => {
      __logger.info('usernameVerify function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
    })
    .catch(err => {
      __logger.error('usernameVerify function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = usernameVerify
