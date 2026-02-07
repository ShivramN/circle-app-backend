const __logger = require('../../../lib/logger')
const ValidationService = require('../services/validation')
const PlanService = require('../services/dbData')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const UserService = require('../../user/services/dbData')
const checkDays = require('../../../lib/util/checkTime')

const getStart = (req, res) => {
  __logger.info('Inside getStart')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  let planValidDays = req.userConfig && req.userConfig.planValidDays ? req.userConfig.planValidDays : 0
  const createdOn = req.userConfig && req.userConfig.createdOn ? req.userConfig.createdOn : 0

  const userService = new UserService()
  const validationService = new ValidationService()
  const planService = new PlanService()
  validationService.checkPlanName(req.body)
    .then(() => {
      return planService.checkPlan(req.body.planId)
    })
    .then((data) => {
      const totalDays = checkDays(createdOn)
      if (planValidDays > 0) planValidDays -= totalDays
      planValidDays += data.planTotalDays
      return userService.updatePlan(userId, data.planId, planValidDays)
    })
    .then((data) => {
      return planService.insertTransaction(userId, data)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { userId, planId: data } })
    })
    .catch(err => {
      __logger.error('error in getStart function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getStart
