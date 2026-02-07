const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../../user/services/validation')
const Service = require('../../user/services/dbData')
const __util = require('../../../lib/util')

const updateUserInfo = (req, res) => {
  __logger.info('Inside updateUserInfo')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validation = new Validation()
  const service = new Service()
  validation.checkUserInfo(req.body)
    .then(data => {
      return service.updateUserInfo(data, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'user update successfully' })
    })
    .catch(err => {
      __logger.error('error in updateUserInfo function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = updateUserInfo
