const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const ValidationService = require('../services/validation')
const UserService = require('../services/dbData')

function searchUser (req, res) {
  __logger.info('searchUser ::>>>>>>..')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validatonService = new ValidationService()
  const userService = new UserService()
  validatonService.valSearchUser(req.body)
    .then(data => {
      __logger.info('searchUser :: data::>>>>>>.. then 1', data)
      return userService.filterUsername(data.searchUser, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = searchUser
