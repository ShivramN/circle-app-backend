const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const VoiceService = require('../services/dbData')

const tagVoiceList = (req, res) => {
  __logger.info('inside tagVoiceList :: ')
  const validate = new ValidationService()
  const voiceService = new VoiceService()
  let limit = 0
  let page = 0

  validate.valPaginationWithUserId(req.query)
    .then((data) => {
      limit = req.query.limit ? parseInt(req.query.limit) : 100
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return voiceService.tagVoiceList(req.query.userId, limit, offset)
    })
    .then(data => {
      __logger.info('tagVoiceList function :: Then 2', { data: data[1][0].totalTagVoices })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalTagVoices: data[1][0].totalTagVoices || 0, voicesList: data[0] } })
    })
    .catch(err => {
      __logger.error('tagVoiceList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = tagVoiceList
