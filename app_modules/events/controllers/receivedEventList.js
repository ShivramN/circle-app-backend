const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const VoiceService = require('../services/dbData')

const receivedEventList = (req, res) => {
  __logger.info('inside receivedEventList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const voiceService = new VoiceService()
  let limit = 0
  let page = 0

  validate.valEventList(req.query)
    .then((data) => {
      limit = req.query.limit ? parseInt(req.query.limit) : 100
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return voiceService.receivedEventList(userId, limit, offset, req.query.filterEvent)
    })
    .then(data => {
      __logger.info('receivedEventList function :: Then 2', { data: data[1][0].totalReceivedEvent })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalReceivedEvent: data[1][0].totalReceivedEvent, eventList: data[0] } })
    })
    .catch(err => {
      __logger.error('receivedEventList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = receivedEventList
