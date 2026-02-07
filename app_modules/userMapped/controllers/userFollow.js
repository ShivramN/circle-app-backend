const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const Service = require('../services/dbData')

const userFollows = (req, res) => {
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  __logger.info('Inside userFollows')
  const validation = new Validation()
  const service = new Service()
  validation.checkFollowId(req.params, userId)
    .then(data => {
      return service.checkFollowMapped(userId, req.params.followingId)
    })
    .then(data => {
      return service.insertFollowMapped(userId, req.params.followingId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
    })
    .catch(err => {
      __logger.error('error in userFollows function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = userFollows
