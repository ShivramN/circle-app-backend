const __logger = require('../../../lib/logger')
// const __db = require('../../../lib/db')
const __constants = require('../../../config/constants')
const Validation = require('../../user/services/validation')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')

const userProfile = (req, res) => {
  __logger.info('Inside userProfile')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validation = new Validation()
  const service = new Service()
  validation.checkUserId(req.params)
    .then(data => {
      return service.checkUserProfile(data.userId, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data })
    })
    .catch(err => {
      __logger.error('error in userProfile function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = userProfile
