const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const __config = require('../../../config/index')

const controller = (req, res) => {
  __logger.info('Inside forceUpdate')
  const validate = new ValidationService()
  validate.forceUpdate(req.body)
    .then(data => {
      __logger.info('forceUpdate :: controller :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { forceUpdate: Boolean(req.body.iOSAppVersion < parseFloat(__config.iosAppVersion)), appStoreAppUrl: __config.appStoreAppUrl } })
    })
    .catch(err => {
      __logger.error('error: forceUpdate function', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = controller
