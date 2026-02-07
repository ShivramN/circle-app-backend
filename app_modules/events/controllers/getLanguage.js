const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const EventService = require('../services/dbData')

const getLanguage = (req, res) => {
  __logger.info('inside getLanguage :: ')
  const eventService = new EventService()

  eventService.getLanguage()
    .then(data => {
      __logger.info('getLanguage function :: Then 1', { data })
      data.sort((a, b) => a.languageName.localeCompare(b.languageName))
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data })
    })
    .catch(err => {
      __logger.error('getLanguage function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getLanguage
