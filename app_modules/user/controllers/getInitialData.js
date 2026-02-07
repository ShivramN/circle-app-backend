const PlanService = require('../../subscription/services/dbData')
const __util = require('../../../lib/util')
const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const UserService = require('../services/dbData')

const getUserDetails = (req, res) => {
  __logger.info('Inside getUserDetails')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planService = new PlanService()
  const userService = new UserService()
  let userDetail
  userService.getAllUserDetalis(userId)
    .then(data => {
      userDetail = data
      return planService.checkPlan(userDetail.planId)
    })
    .then(data => {
      delete userDetail.planId
      userDetail.subscription = data
      __logger.info('getUserDetails function :: Then 1', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { user: userDetail } })
    })
    .catch(err => {
      __logger.error('getUserDetails function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getUserDetails
