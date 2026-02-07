const __constants = require('../../config/constants')
const __config = require('../../config/index')
const __logger = require('../logger')
const aws = require('aws-sdk');
const multer = require('multer');
const crypto = require('crypto')
const multerS3 = require('multer-s3');
const generateId = require('../util/password_mgmt').genRandomString

// Configure S3-compatible storage (AWS S3 or DigitalOcean Spaces)
const s3Config = {
  secretAccessKey: __config.aws_s3.secretAccessKey,
  accessKeyId: __config.aws_s3.accessKeyId,
  region: __config.aws_s3.region
}

// Add endpoint for DigitalOcean Spaces or other S3-compatible services
if (__config.aws_s3.endpoint) {
  s3Config.endpoint = new aws.Endpoint(__config.aws_s3.endpoint)
}

aws.config.update(s3Config)

const s3 = new aws.S3();

const singleFile = multerS3({
  s3: s3,
  bucket: __config.aws_s3.bucketName,
  acl: __config.aws_s3.aclAccess,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {

    const userId = req.user && req.user.userId ? req.user.userId : 0
    const hash = crypto.createHash(__config.hashMethod.createHex).update(userId).digest(__config.hashMethod.HexDigest).substr(0, 12)
    const bucketName = req.bucketName + `${hash}.png`
    cb(null, bucketName)
  }
})

const singleFileUpload = multerS3({
  s3: s3,
  bucket: __config.aws_s3.bucketName,
  acl: __config.aws_s3.aclAccess,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    let userId = req.user && req.user.userId ? req.user.userId : 0
    userId += new Date()
    const hash = crypto.createHash(__config.hashMethod.createHex).update(userId).digest(__config.hashMethod.HexDigest).substr(0, 12)
    const bucketName = req.bucketName + `${hash}.png`
    cb(null, bucketName)
  }
})

const singleFileForVocie = multerS3({
  s3: s3,
  bucket: __config.aws_s3.bucketName,
  acl: __config.aws_s3.aclAccess,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const userId = req.user && req.user.userId ? req.user.userId : 0
    const hash = crypto.createHash(__config.hashMethod.createHex).update(userId).digest(__config.hashMethod.HexDigest).substr(0, 12)
    const extension = file.originalname.split('.').length > 0 ? file.originalname.split('.')[file.originalname.split('.').length - 1] : ''
    const url = req.bucketName + `${hash}/${generateId(10)}.${extension}`
    cb(null, url)
  }
})

const multipleFile = multerS3({
  s3: s3,
  bucket: __config.aws_s3.bucketName,
  acl: __config.aws_s3.aclAccess,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const userId = req.user && req.user.userId ? req.user.userId : 0
    const hash = crypto.createHash(__config.hashMethod.createHex).update(userId).digest(__config.hashMethod.HexDigest).substr(0, 12)
    const extension = file.originalname.split('.').length > 0 ? file.originalname.split('.')[file.originalname.split('.').length - 1] : ''
    const url = req.bucketName + `${hash}/${generateId(10)}.${extension}`
    cb(null, url)
  }
})

const thumbnailFile = multerS3({
  s3: s3,
  bucket: __config.aws_s3.bucketName,
  acl: __config.aws_s3.aclAccess,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const userId = req.user && req.user.userId ? req.user.userId : 0
    const hash = crypto.createHash(__config.hashMethod.createHex).update(userId).digest(__config.hashMethod.HexDigest).substr(0, 12)
    const extension = file.originalname.split('.').length > 0 ? file.originalname.split('.')[file.originalname.split('.').length - 1] : ''
    const url = __config.thumbnailUrl + `${hash}/${generateId(10)}.${extension}`
    cb(null, url)
  }
})

//endregion


const filter = function (req, file, cb) {
  __logger.info('filter')
  var filetypes = /(jpe?g|png)$/i
  let fileExt = file.originalname.split('.')
  fileExt = fileExt[fileExt.length - 1]
  var extname = filetypes.test(fileExt.toLowerCase())
  __logger.info('file mime type filter  -->', extname, fileExt)
  if (extname) {
    return cb(null, true)
  } else {
    const err = { ...__constants.RESPONSE_MESSAGES.INVALID_FILE_TYPE, err: 'File upload only supports the following filetypes - jpg, jpeg, png' }
    cb(err)
  }
}

const filterImageVideo = function (req, file, cb) {
  __logger.info('filter')
  var filetypes = /(jpe?g|png|mp4|avi|mkv|mov|MOV)$/i
  let fileExt = file.originalname.split('.')
  fileExt = fileExt[fileExt.length - 1]
  var extname = filetypes.test(fileExt.toLowerCase())
  __logger.info('file mime type filter  -->', extname, fileExt)
  if (extname) {
    return cb(null, true)
  } else {
    const err = { ...__constants.RESPONSE_MESSAGES.INVALID_FILE_TYPE, err: 'File upload only supports the following filetypes - jpg, jpeg, png, mp4, avi, mkv, mov, MOV' }
    cb(err)
  }
}

const uploadImage = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: singleFile
}).single('profilePic');

const uploadCategory = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: singleFileUpload
}).single('categoryPic')

const uploadSubcription = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: singleFileUpload
}).single('subcriptionPic')

const uploadNews = multer({
  fileFilter: filterImageVideo,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: multipleFile
}).array('newsUpload', 10)

const uploadVoices = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: singleFileForVocie
}).single('voicesUpload')

const uploadThumbnail = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: thumbnailFile
}).single('thumbnailUpload');

const newsBanner = multer({
  fileFilter: filter,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: singleFileForVocie
}).single('newsBanner');

const uploadEvent = multer({
  fileFilter: filterImageVideo,
  limits: { fileSize: __constants.FILE_MAX_UPLOAD_IN_BYTE },
  storage: multipleFile
}).array('eventUpload', 10)

module.exports = { uploadImage, uploadCategory, uploadNews, uploadVoices, uploadThumbnail, newsBanner, uploadEvent, uploadSubcription };
