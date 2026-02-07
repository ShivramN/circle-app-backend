const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __config = require('../../../config/index')
const __util = require('../../../lib/util')
const upload = require('../../../lib/uploads').uploadEvent
const PlanService = require('../../subscription/services/dbData')

const addEventMultiMedia = (req, res) => {
  __logger.info('inside addEventMultiMedia :: ')
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  req.bucketName = __config.thumbnailUrl
  const planService = new PlanService()

  planService.checkPlan(planId)
    .then((data) => {
      __logger.info('addEventMultiMedia :: Then 1')
      if (data && data.addEvent) {
        upload(req, res, function (err, data) {
          if (err) {
            if (err.code === __constants.CUSTOM_CONSTANT.UPLOAD_ERROR_MSG.LIMIT_FILE_SIZE) {
              return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_FILE_SIZE, err: __constants.FILE_MAX_UPLOAD_IN_BYTE })
            } else {
              return res.send(err)
            }
          }
          if (!req.files || (req.files && req.files.length <= 0)) {
            return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PROVIDE_FILE, err: __constants.RESPONSE_MESSAGES.PROVIDE_FILE.message })
          } else {
            const eventLocation = req.files.map((data) => {
              const obj = { url: data.location, mimeType: data.mimetype }
              return obj
            })
            return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { eventLocation } })
          }
        })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
}

module.exports = addEventMultiMedia
