const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Service = require('../services/dbData')
const ValidationService = require('../services/validation')

const updateToken = (req, res) => {
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  __logger.info('Inside updateToken')
  const service = new Service()
  validate.checkToken(req.body)
    .then(data => {
      service.updateToken(userId, req.body.fcmToken)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'updated successfully' })
    })
    .catch(err => {
      __logger.error('error in updateToken function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = updateToken
