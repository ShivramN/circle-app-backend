const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const NewService = require('../../news/services/dbData')
const VoiceService = require('../../voices/services/dbData')
const EventService = require('../../events/services/dbData')
const __util = require('../../../lib/util')

const checkPoints = (req, res) => {
  __logger.info('Inside checkPoints')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validation = new Validation()
  const service = {
    [__constants.MEDIA_TYPE[0]]: new NewService(),
    [__constants.MEDIA_TYPE[1]]: new VoiceService(),
    [__constants.MEDIA_TYPE[2]]: new EventService()
  }
  let limit = 0
  let page = 0
  validation.filterMedia(req.query)
    .then(data => {
      limit = req.query.limit ? parseInt(req.query.limit) : 10
      page = req.query.page ? parseInt(req.query.page) : 1
      const offset = limit * (page - 1)
      return service[data.mediaType].getPointList(userId, data.sortType, limit, offset)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data })
    })
    .catch(err => {
      __logger.error('error in check Points function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = checkPoints
