const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')

const getUserFollower = (req, res) => {
  __logger.info('Inside getUserFollower')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validation = new Validation()
  const service = new Service()
  let limit = 0
  let page = 0
  validation.filterValid(req.body)
    .then(data => {
      limit = req.body.limit ? parseInt(req.body.limit) : 10
      page = req.body.page ? parseInt(req.body.page) : 1
      const offset = limit * (page - 1)
      return service.getFollowerList(data.userId, userId, limit, offset, data.searchUser)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data })
    })
    .catch(err => {
      __logger.error('error in getUserFollower function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserFollower
