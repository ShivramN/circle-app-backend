const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const VoiceService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const addVoice = (req, res) => {
  __logger.info('inside addVoice :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const voiceService = new VoiceService()
  const planService = new PlanService()

  validate.voiceTemplate(req.body)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('addVoice function', data)
      if (data && data.addVoice) {
        req.body.voicePlaform = req.body.voicePlaform ?? []
        req.body.tagUserId = req.body.tagUserId ?? []
        return voiceService.checkVoiceByAll(req.body, userId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then((data) => {
      __logger.info('addVoice :: then 1', data)
      return voiceService.insertVoice(req.body, userId)
    })
    .then(data => {
      __logger.info('addVoice function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { voiceId: data } })
    })
    .catch(err => {
      __logger.error('addVoice function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = addVoice
