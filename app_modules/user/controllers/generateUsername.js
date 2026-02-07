const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UserService = require('../services/dbData')
const uniqueGenerator = require('../../../lib/util/uniqueUsername')

const generateUsername = (req, res) => {
  __logger.info('Inside generateUsername')
  const validate = new ValidationService()
  const userService = new UserService()
  validate.generateUsername(req.body)
    .then(data => {
      __logger.info('generateUsername :: Then 1', { data })
      return uniqueGenerator(req.body.email)
    })
    .then(data => {
      return userService.checkUsername(data, req.body.email)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { username: data } })
    })
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = generateUsername
