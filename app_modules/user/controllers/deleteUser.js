const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const UserService = require('../services/dbData')

const deleteUser = (req, res) => {
  __logger.info('Inside deleteUser')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const userservice = new UserService()
  userservice.deleteUser(userId)
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'User deleted successfully ' })
    })
    .catch(err => {
      __logger.error('error in deleteUser function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = deleteUser
