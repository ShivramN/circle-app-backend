const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const EventService = require('../services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const buyEvent = (req, res) => {
  __logger.info('inside buyEvent :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const userCoin = req.userConfig && req.userConfig.coinRewards ? parseInt(req.userConfig.coinRewards) : 0
  const validate = new ValidationService()
  const eventService = new EventService()
  let isExists, ownerId

  validate.checkEventId(req.body)
    .then(data => {
      return eventService.checkEventBuy(req.body.eventId, userId)
    })
    .then(data => {
      isExists = data.isExists
      ownerId = data.userId
      if (userCoin < data.eventCoinPoint) {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.COIN_LIMIT, data: { inSufficient: true }, err: __constants.RESPONSE_MESSAGES.COIN_LIMIT.message })
      } else {
        return eventService.coinRedemmed(data.eventCoinPoint, req.body.eventId, userId, __constants.MEDIA_TYPE[2], __constants.SUB_TYPE[0])
      }
    })
    .then(data => {
      __logger.info('buyEvent function', isExists)
      return isExists ? eventService.updateEventBuy(req.body.eventId, userId) : eventService.addEventBuy(req.body.eventId, userId, ownerId)
    })
    .then(data => {
      __logger.info('buyEvent function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'successfully buyed' })
    })
    .catch(err => {
      __logger.error('buyEvent function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: err.data || null, err: err.err })
    })
}

module.exports = buyEvent
