const APP_NAME = 'demo'
const DB_NAME = 'circleapp'
const MYSQL_NAME = 'circle_app'
const CUSTOM_CONSTANT = {
  UPLOAD_ERROR_MSG: {
    LIMIT_FILE_SIZE: 'LIMIT_FILE_SIZE'
  },
  SESSION_TIME: 7776000, // 90 days
  EXIRES_TIME: 604800, // 1 week
  ADMIN_SESSION_TIME: 86400
}

const SUBSCRIPTION = {
  free_plan: '3e1ae2fb-454b-4bb4-a9dd-dcdef2a40d73',
  basic: 'f717a43a-826c-48a2-9a60-649c298cef09',
  paid_plan: 'c43bf5aa-00ac-4f8b-b254-af89db812201'
}

const VERIFICATION_CHANNEL = {
  email: { name: 'email', expiresIn: 5 * 60 * 1000, codeLength: 4 }
}
const PUBLIC_FOLDER_PATH = process.env.PWD + '/public'
const SERVER_TIMEOUT = 2 * 60 * 1000
const VALIDATOR = {
  fullName: '^[A-Z][a-zA-Z]*([A-Z]| [A-Z][a-zA-Z]*)+$',
  password: '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$',
  username: '^[A-Za-z][A-Za-z0-9@#$&_-]{3,50}$',
  number: '^[1-9][0-9]*$',
  phoneNumber: '^\\d{1,15}$',
  phoneCode: '^\\d{1,5}$',
  time: /([01]?[0-9]|2[0-3]):[0-5][0-9]/gm,
  dateFormat: /^$|^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/g,
  eventFormat: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/g,
  identifyTag: /@[\w]+/gm,
  booleanValue: /^(0|1)$/gm
}
const FILE_MAX_UPLOAD_IN_BYTE = 5000000000 // 500 MB
const PROVIDER_TYPE = {
  email: 'email'
}

const EVENT_INVITE_TYPE = ['private', 'following', 'follower', 'public']

const SOCIAL_MEDIA = ['facebook', 'youtube', 'twitter', 'instagram', 'other']

const GENDER_TYPE = ['male', 'female', 'other', '']

const VERIFIED_STATUS = ['pending', 'rejected', 'accepted', 'all']

const SORT_TYPE = ['date', 'low', 'high']

const MEDIA_TYPE = ['news', 'voice', 'event']

const EVENT_LIST_FILTER = ['upcoming', 'past']

const SUB_TYPE = ['buy_event', 'create_event']

const WEBHOOK_ENDPOINT = `/${APP_NAME}/api/payment/webhook`

const STRIPE_API_VERSION = '2022-11-15'

const STRIPE_STATUS = ['requested', 'success', 'failed']

const PAYMENT_TYPE = ['stripe', 'applePay']

const IMAGE_TYPE = ['portrait', 'landscape', 'square']

const NOTIFICATION_MESSAGE = {
  sharedNews: ' has shared a news with you',
  sharedVoice: ' has shared a voice with you',
  sharedEvent: ' has shared an event with you',
  tagVoice: ' has mentioned you in their voice',
  eventInvited: ' has invited you to an event',
  eventAlert: 'You have an event "[eventTitle]" today at ',
  userFollow: ' has started following you'
}
const MEDIA_TYPE_1 = ['News', 'Voice', 'Event', 'Voice Mention', 'Event Invitation', 'Event Reminder', 'Follow']
const NOTIFICATION_TYPE = ['sharedNews', 'sharedVoice', 'sharedEvent', 'tagVoice', 'eventInvited', 'eventAlert', 'userFollow']
const SOCIAL_LOGIN_TYPE = ['google', 'facebook', 'apple', 'email']

module.exports.RESPONSE_MESSAGES = require('./status-response')
module.exports.CUSTOM_CONSTANT = CUSTOM_CONSTANT
module.exports.VERIFICATION_CHANNEL = VERIFICATION_CHANNEL
module.exports.PUBLIC_FOLDER_PATH = PUBLIC_FOLDER_PATH
module.exports.APP_NAME = APP_NAME
module.exports.DB_NAME = DB_NAME
module.exports.SERVER_TIMEOUT = SERVER_TIMEOUT
module.exports.MYSQL_NAME = MYSQL_NAME
module.exports.VALIDATOR = VALIDATOR
module.exports.FILE_MAX_UPLOAD_IN_BYTE = FILE_MAX_UPLOAD_IN_BYTE
module.exports.PROVIDER_TYPE = PROVIDER_TYPE
module.exports.SUBSCRIPTION = SUBSCRIPTION
module.exports.EVENT_INVITE_TYPE = EVENT_INVITE_TYPE
module.exports.SOCIAL_MEDIA = SOCIAL_MEDIA
module.exports.GENDER_TYPE = GENDER_TYPE
module.exports.VERIFIED_STATUS = VERIFIED_STATUS
module.exports.SORT_TYPE = SORT_TYPE
module.exports.EVENT_LIST_FILTER = EVENT_LIST_FILTER
module.exports.MEDIA_TYPE = MEDIA_TYPE
module.exports.SUB_TYPE = SUB_TYPE
module.exports.WEBHOOK_ENDPOINT = WEBHOOK_ENDPOINT
module.exports.STRIPE_API_VERSION = STRIPE_API_VERSION
module.exports.STRIPE_STATUS = STRIPE_STATUS
module.exports.NOTIFICATION_MESSAGE = NOTIFICATION_MESSAGE
module.exports.MEDIA_TYPE_1 = MEDIA_TYPE_1
module.exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE
module.exports.SOCIAL_LOGIN_TYPE = SOCIAL_LOGIN_TYPE
module.exports.PAYMENT_TYPE = PAYMENT_TYPE
module.exports.IMAGE_TYPE = IMAGE_TYPE
