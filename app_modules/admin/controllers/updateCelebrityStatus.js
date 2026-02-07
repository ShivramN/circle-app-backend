const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const updateCelebrityStatus = (req, res) => {
  __logger.info('Inside updateCelebrityStatus')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.checkUserId(req.body)
    .then(data => {
      __logger.info('addCategory :: then 1')
      return userService.updateCelebrityStatus(req.body.userId, req.body.celebrityStatus, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'user status change successfully' })
    })
    .catch(err => {
      __logger.error('error: updateCelebrityStatus function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = updateCelebrityStatus
