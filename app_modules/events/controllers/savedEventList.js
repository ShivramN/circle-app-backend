const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')

const savedVoiceList = (req, res) => {
  __logger.info('inside savedVoiceList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const eventService = new EventService()
  let limit = 0
  let page = 0

  validate.valEventList(req.query)
    .then((data) => {
      limit = req.query.limit ? parseInt(req.query.limit) : 100
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return eventService.savedEventList(userId, limit, offset, req.query.filterEvent)
    })
    .then(data => {
      __logger.info('savedVoiceList function :: Then 2', { data: data[1][0].totalSavedEvent })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { totalSavedEvent: data[1][0].totalSavedEvent, eventsList: data[0] } })
    })
    .catch(err => {
      __logger.error('savedVoiceList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = savedVoiceList
