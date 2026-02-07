const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const ValidationService = require('../services/validation')
const VoiceService = require('../services/dbData')
const PlanService = require('../../subscription/services/dbData')
const rejectHandler = require('../../../lib/util/rejectionHandler')

const updateVoice = (req, res) => {
  __logger.info('inside updateVoice :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const validate = new ValidationService()
  const voiceService = new VoiceService()
  const planService = new PlanService()

  validate.voiceUpdateTemplate(req.body)
    .then(data => {
      return planService.checkPlan(planId)
    })
    .then(data => {
      __logger.info('updateVoice function', data)
      if (data && data.addVoice) {
        return voiceService.checkUserVoiceById(req.body.voiceId, userId)
      } else {
        return rejectHandler({ type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
    .then((data) => {
      __logger.info('updateVoice :: then 1', data)
      req.body.voicePlaform = req.body.voicePlaform ?? []
      req.body.tagUserId = req.body.tagUserId ?? []
      return voiceService.updateVoice(req.body, userId)
    })
    .then(data => {
      __logger.info('updateVoice function :: Then 2', { data })
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: {} })
    })
    .catch(err => {
      __logger.error('updateVoice function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = updateVoice
