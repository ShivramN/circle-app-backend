const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const deleteLanguage = (req, res) => {
  __logger.info('Inside deleteLanguage')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.valLanguageId(req.params)
    .then(data => {
      return userService.getLanguageById(req.params.languageId)
    })
    .then(data => {
      __logger.info('deleteLanguage :: then 1')
      return userService.deleteLangauge(req.params.languageId, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'delete language successfully' })
    })
    .catch(err => {
      __logger.error('error: deleteLanguage function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = deleteLanguage
