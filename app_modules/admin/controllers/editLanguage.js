const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const editLangauge = (req, res) => {
  __logger.info('Inside editLangauge')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.updateLangauge(req.body)
    .then(data => {
      return userService.getLanguageById(req.body.languageId)
    })
    .then(data => {
      __logger.info('updateLangauge :: then 1')
      return userService.updateLanguage(req.body, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'langauge update successfully' })
    })
    .catch(err => {
      __logger.error('error: editLangauge function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = editLangauge
