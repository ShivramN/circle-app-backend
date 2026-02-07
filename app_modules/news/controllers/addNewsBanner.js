const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const __config = require('../../../config/index')
const upload = require('../../../lib/uploads').newsBanner
const PlanService = require('../../subscription/services/dbData')

const addNewsBanner = (req, res) => {
  __logger.info('inside addNewsBanner :: ')
  const planId = req.userConfig && req.userConfig.planId ? req.userConfig.planId : 0
  const planService = new PlanService()
  req.bucketName = __config.newsUrl
  planService.checkPlan(planId)
    .then((data) => {
      __logger.info('addNewsBanner :: Then 1')
      if (data && data.addNews) {
        upload(req, res, function (err, data) {
          if (err) {
            if (err.code === __constants.CUSTOM_CONSTANT.UPLOAD_ERROR_MSG.LIMIT_FILE_SIZE) {
              return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_FILE_SIZE, err: __constants.FILE_MAX_UPLOAD_IN_BYTE })
            } else {
              return res.send(err)
            }
          }
          if (!req.file) {
            return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PROVIDE_FILE, err: __constants.RESPONSE_MESSAGES.PROVIDE_FILE.message })
          } else {
            return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { newsBannerLocation: { url: req.file.location, mimeType: req.file.mimetype } } })
          }
        })
      } else {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PLAN_ACCESS, err: __constants.RESPONSE_MESSAGES.PLAN_ACCESS.message })
      }
    })
}

module.exports = addNewsBanner
