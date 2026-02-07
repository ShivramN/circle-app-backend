const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const __config = require('../../../config')
const upload = require('../../../lib/uploads').uploadCategory

const uploadImage = (req, res) => {
  __logger.info('inside uploadImage :: ')
  req.bucketName = __config.categoryUrl
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
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { categoryLocation: req.file.location } })
    }
  })
}

module.exports = uploadImage
