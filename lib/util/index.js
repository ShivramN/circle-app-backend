const __constants = require('../../config/constants')
var utils = {}

var moment = require('moment-timezone')
var _ = require('lodash')
var __logger = require('../logger')

// hasOwnProperty of object
var hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * check valid response code [mention in constants>>MESSAGES].
 * @memberof utils
 * @param code {number} response code
 * @return {{valid: boolean, statusCode: number}}
 */
function validateResponseCode (code) {
  var obj = {
    valid: false,
    statusCode: 200
  }
  for (var key in __constants.RESPONSE_MESSAGES) {
    if (__constants.RESPONSE_MESSAGES[key].code === code) {
      obj.valid = true
      obj.statusCode = __constants.RESPONSE_MESSAGES[key].status_code
      break
    }
  }
  return obj
};
utils.validateResponseCode = validateResponseCode

/**
 * send response of service based on options provided.
 * @memberof utils
 * @param response {object} used to send response
 * @param options {{type:object,custom_msg:string,custom_code:number,err:object,data:object}} send options
 */
function send (response, options) {

  if (options.custom_response) {
    return response.status(options.custom_status_code || 200).json(options.custom_response)
  }

  var resData = {}
  var code = __constants.RESPONSE_MESSAGES.INVALID_CODE.code
  var msg = __constants.RESPONSE_MESSAGES.INVALID_CODE.message
  var data = options.data || null
  var err = options.err || null
  if (!isEmpty(options.type) && !findMissingKeyInObject(options.type, ['code', 'message'])) {
    code = options.type.code
    msg = options.type.message
  }
  if (options.custom_code) { code = options.custom_code }
  if (options.custom_msg) { msg = options.custom_msg }

  if (code === __constants.RESPONSE_MESSAGES.INVALID_CODE.code) {
    msg = __constants.RESPONSE_MESSAGES.INVALID_CODE.message
    data = null
    err = "Response code not mention so default INVALID_CODE response code selected. please mention valid response code, refer 'constants >> RESPONSE_MESSAGES object'"
  }

  var validCodeObj = validateResponseCode(code)
  if (!validCodeObj.valid) { __logger.info("add response code '" + code + "' in constants >> RESPONSE_MESSAGES object") }
  resData.code = code
  resData.msg = msg
  resData.data = data
  // if (process.env.NODE_ENV !== __constants.CUSTOM_CONSTANT.PROD_ENV && err) {
  resData.error = err
  // }
  if (!response.is_sent) {
    response.is_sent = true
    if (!_.isEmpty(options.headers) && !_.isArray(options.headers) && _.isPlainObject(options.headers)) {
      response.set(options.headers)
    }
    response.status(validCodeObj.statusCode || 200).json(resData)
  }
};
utils.send = send
/**
 * Check object contain all keys in keyList
 * @memberof utils
 * @param obj {object} object
 * @param keyList {array} array of object key
 */
function findMissingKeyInObject (obj, keyList) {
  var missingKeys = []
  if (keyList && keyList.length > 0) {
    _.each(keyList, function (key) {
      if (!hasOwnProperty.call(obj, key) || obj[key] === null) { missingKeys.push(key) }
    })
  }
  if (missingKeys.length === 0) { return false } else { return missingKeys.toString() }
}
utils.findMissingKeyInObject = findMissingKeyInObject

/**
 * 'true' if object is empty otherwise 'false'
 * @memberof utils
 * @param obj {object} object can be 'object,string,number,array'
 * @returns {boolean}
 */
function isEmpty (obj) {
  // null and undefined are "empty"
  if (obj === 0 || obj === false) { return false }

  if (obj === undefined || obj == null || obj === '') { return true }

  if (typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean') { return false }
  // Assume if it has a length property with a non-zero value
  // that property is correct.
  if (obj.length > 0) { return false }
  if (obj.length <= 0) { return true }

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) { return false }
  }
  return true
}
utils.isEmpty = isEmpty

/**
 * get expire timestamp based on second provided.
 * @memberof utils
 * @param seconds {number} seconds to add in current time
 * @returns {number}
 */
function expiresAt (seconds) {
  var date = new Date()
  date.setSeconds(date.getSeconds() + seconds)
  return date.getTime()
}
utils.expiresAt = expiresAt
module.exports = utils
