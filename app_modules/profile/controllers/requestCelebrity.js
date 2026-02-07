const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Service = require('../../user/services/dbData')
const __util = require('../../../lib/util')

const requestCelebrity = (req, res) => {
  __logger.info('Inside requestCelebrity')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const service = new Service()
  service.requestCelebrity(userId)
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'request send successfully' })
    })
    .catch(err => {
      __logger.error('error in requestCelebrity function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = requestCelebrity
