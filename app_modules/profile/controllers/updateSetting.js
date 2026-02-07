const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const Validation = require('../services/validation')
const Service = require('../services/dbData')
const __util = require('../../../lib/util')

const getUserFollowing = (req, res) => {
  __logger.info('Inside getUserFollowing')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validation = new Validation()
  const service = new Service()
  validation.settingVal(req.body)
    .then(data => {
      return service.updateSetting(req.body, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'Updated successfully' })
    })
    .catch(err => {
      __logger.error('error in getUserFollowing function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserFollowing
