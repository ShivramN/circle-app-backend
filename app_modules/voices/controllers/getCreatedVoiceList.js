const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const VoiceService = require('../services/dbData')

const getCreatedVoiceList = (req, res) => {
  __logger.info('inside getCreatedVoiceList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const voiceService = new VoiceService()
  let limit = 0
  let page = 0

  validate.valPagination(req.query)
    .then((data) => {
      limit = req.query.limit ? parseInt(req.query.limit) : 100
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return voiceService.createdVoiceList(userId, limit, offset)
    })
    .then(data => {
      __logger.info('getCreatedVoiceList function :: Then 2', { data: data[1][0].totalSavedVoices })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalCreatedVoice: data[1][0].totalCreatedVoice || 0, voicesList: data[0] } })
    })
    .catch(err => {
      __logger.error('getCreatedVoiceList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getCreatedVoiceList
