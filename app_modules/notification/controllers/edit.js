const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const Service = require('../services/dbData')

const editReadStatus = async (req, res) => {
  __logger.info('inside editReadStatus :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new Validation()
  const service = new Service()
  validate.Validation(req.query)
    .then((data) => {
      return service.updateStatus(userId, req.query.notificationId)
    })
    .then(data => {
      __logger.info('editReadStatus function :: Then 1')
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'Updated Successfully' })
    })
    .catch(err => {
      __logger.error('editReadStatus function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = editReadStatus
