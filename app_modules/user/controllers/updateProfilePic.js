const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __config = require('../../../config')
const __logger = require('../../../lib/logger')
const upload = require('../../../lib/uploads/index').uploadImage
const UserService = require('../services/dbData')

const updateProfilePic = (req, res) => {
  __logger.info('inside updateProfilePic :: ')
  const userId = req.user && req.user.userId ? req.user.userId : 0
  req.bucketName = __config.photoUrl
  const userService = new UserService()
  upload(req, res, function (err, data) {
    if (err) {
      if (err.code === __constants.CUSTOM_CONSTANT.UPLOAD_ERROR_MSG.LIMIT_FILE_SIZE) {
        return __util.send(res, { type: __constants.RESPONSE_MESSAGES.INVALID_FILE_SIZE, err: __constants.FILE_MAX_UPLOAD_IN_BYTE })
      } else {
        return res.send(err)
      }
    }
    if (!req.file) {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.PROVIDE_FILE, error: __constants.RESPONSE_MESSAGES.PROVIDE_FILE.message })
    } else {
      userService.setPhotoUrl(userId, req.file.location)
        .then(results => {
          return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { profilelocation: req.file.location } })
        })
        .catch(err => {
          __logger.error('error: updateProfilePic function ', err)
          return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || {} })
        })
    }
  })
}

module.exports = updateProfilePic
