const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')

const getDetail = (req, res) => {
  __logger.info('Inside getDetail')
  const validation = new Validation()
  const service = new Service()
  validation.valUserId(req.params)
    .then(data => {
      return service.getDetailById(req.params.userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('error in getDetail function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getDetail
