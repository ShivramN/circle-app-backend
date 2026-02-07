const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')

const getLanguageById = (req, res) => {
  __logger.info('Inside getLanguageById')
  const validation = new Validation()
  const service = new Service()
  validation.valLanguageId(req.params)
    .then(data => {
      return service.getLanguageById(req.params.languageId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('error in getLanguageById function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getLanguageById
