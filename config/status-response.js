/**
 * @namespace <b> -API-RESPONSE- </b>
 * @description Click the below link for all the API Response with its related status code
 */

module.exports = {
  INVALID_REQUEST: {
    status_code: 200,
    code: 200,
    message: 'Invalid request'
  },
  NOT_BUY: {
    status_code: 200,
    code: 200,
    message: 'Subscription not buyed'
  },
  USERID_SAME: {
    status_code: 200,
    code: 200,
    message: 'does not support your user id'
  },
  PWD_INVALID: {
    status_code: 200,
    code: 200,
    message: 'Please enter a valid password'
  },
  EMAIL_NOT_VALID: {
    status_code: 200,
    code: 200,
    message: 'Please enter a valid emailId'
  },
  NOT_FOUND: {
    status_code: 404,
    code: 404,
    message: 'requested resource not found.'
  },
  NOT_AUTHORIZED: {
    status_code: 200,
    code: 200,
    message: 'Unauthorized access.'
  },
  NOT_USERID: {
    status_code: 200,
    code: 200,
    message: 'send follower id'
  },
  // PAYMENT_REQUIRED: {
  //   status_code: 200,
  //   code: 2002,
  //   message: 'Payment required.'
  // },
  // ACCESS_DENIED: {
  //   status_code: 403,
  //   code: 2003,
  //   message: 'Access denied'
  // },
  SERVER_TIMEOUT: {
    status_code: 408,
    code: 408,
    message: 'request timeout.'
  },
  // RATE_LIMITED: {
  //   status_code: 429,
  //   code: 2009,
  //   message: 'Too many request. request rate limited'
  // },
  PROVIDE_FILE: {
    status_code: 200,
    code: 200,
    message: 'Please provide a file'
  },
  INVALID_FILE_TYPE: {
    status_code: 200,
    code: 200,
    message: 'Invalid file type'
  },
  // INVALID_URL: {
  //   status_code: 200,
  //   code: 4032,
  //   message: 'Invalid request URL'
  // },
  INVALID_FILE_SIZE: {
    status_code: 200,
    code: 200,
    message: 'File size or pixel is less than expected'
  },
  SERVER_ERROR: {
    status_code: 500,
    code: 500,
    message: 'Something went wrong. Please try again later.'
  },
  // SERVICE_PROVIDER_NOT_PRESENT: {
  //   status_code: 500,
  //   code: 5000,
  //   message: 'Please ensure service provider data is present.'
  // },
  // Note: use codes 2000 to 2999 for api success
  SUCCESS: {
    status_code: 200,
    code: 200,
    message: 'Success'
  },
  NotShare: {
    status_code: 202,
    code: 200,
    message: "This is a private event. You don't have permission to share anyone"
  },
  EMAIL_VC: {
    status_code: 200,
    code: 200,
    message: 'Please check your registered email for verification code'
  },
  PLAN_ACCESS: {
    status_code: 200,
    code: 200,
    message: 'Plan does not have access'
  },
  COIN_LIMIT: {
    status_code: 200,
    code: 200,
    message: 'Do not have enough coins'
  },
  NO_RECORDS_FOUND: {
    status_code: 200,
    code: 200,
    message: 'No record found.'
  },
  INVALID_CODE: {
    status_code: 200,
    code: 201,
    message: 'Response code and msg not mention. please select valid response code.'
  },
  FAILED: {
    status_code: 200,
    code: 200,
    message: 'Failed'
  },
  USER_NOT_FOUND: {
    status_code: 200,
    code: 200,
    message: 'No username found'
  },
  USER_EXIST: {
    status_code: 200,
    code: 200,
    message: 'user already exists.'
  },
  USERNAME_EXIST: {
    status_code: 200,
    code: 200,
    message: 'Username already exists'
  },
  USERNAME_NOT_FOUND: {
    status_code: 200,
    code: 200,
    message: 'No username found'
  },
  USER_STATUS: {
    status_code: 200,
    code: 200,
    message: 'user status should be on pending stage'
  },
  USER_ID_NOT_EXIST: {
    status_code: 200,
    code: 200,
    message: 'User does not exist'
  },
  EMAIL_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'This email id is already register. Please try with other one'
  },
  OTP: {
    status_code: 200,
    code: 200,
    message: 'OTP has been verified'
  },
  CATEGORY_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'category already exists.'
  },
  PLAN_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'Plan already exists.'
  },
  NO_RECORDS_FOUND_FOR_CATEGORY: {
    status_code: 200,
    code: 200,
    message: 'No such category found'
  },
  BASIC_PLAN: {
    status_code: 200,
    code: 200,
    message: 'could not change or delete basic plan'
  },
  NO_RECORDS_FOUND_FOR_PLAN: {
    status_code: 200,
    code: 200,
    message: 'No such plan found'
  },
  NEWS_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'news already exists.'
  },
  VOICE_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'voice already exists.'
  },
  EVENT_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'event already exists.'
  },
  NO_RECORDS_FOUND_FOR_NEWS: {
    status_code: 200,
    code: 200,
    message: 'No such news found'
  },
  NO_RECORDS_FOUND_FOR_VOICE: {
    status_code: 200,
    code: 200,
    message: 'No such voice found'
  },
  NO_RECORDS_FOUND_FOR_EVENT: {
    status_code: 200,
    code: 200,
    message: 'No such event found'
  },
  NOT_BUY_EVENT: {
    status_code: 200,
    code: 200,
    message: 'Not purchase event'
  },
  ALREADY_BUY_EVENT: {
    status_code: 200,
    code: 200,
    message: 'event already purchase'
  },
  USER_FOLLOWED: {
    status_code: 200,
    code: 200,
    message: 'User already followed'
  },
  USER_NOT_FOLLOWED: {
    status_code: 200,
    code: 200,
    message: 'User not followed'
  },
  NO_RIGHT: {
    status_code: 200,
    code: 200,
    message: 'This event is Private event. You are not authorised to access the details'
  },
  SEAT_FULL: {
    status_code: 200,
    code: 200,
    message: 'This event seats are fully booked'
  },
  EVENT_EXPIRED: {
    status_code: 200,
    code: 200,
    message: 'This event has been expired'
  },
  NO_RECORDS_FOUND_FOR_LANGUAGE: {
    status_code: 200,
    code: 200,
    message: 'No such language found'
  },
  LANGUAGE_EXISTS: {
    status_code: 200,
    code: 200,
    message: 'Langauge already exists.'
  },
  INVALID_OTP: {
    status: 200,
    code: 200,
    message: 'Invalid OTP'
  },
  USER_NOT_EXIST: {
    status_code: 200,
    code: 200,
    message: 'User does not exist'
  },
  EMAIL_USERNAME_NOT_EXIST: {
    status_code: 200,
    code: 200,
    message: 'Please enter a valid emailId or username'
  },
  USER_NOT_VERIFIED: {
    status_code: 200,
    code: 200,
    message: 'User not verified'
  },
  ALREADY_SAVED_NEWS: {
    status_code: 200,
    code: 200,
    message: 'News already saved'
  },
  ALREADY_SAVED_VOICE: {
    status_code: 200,
    code: 200,
    message: 'Voice already saved'
  },
  ALREADY_SAVED_EVENT: {
    status_code: 200,
    code: 200,
    message: 'Event already saved'
  },
  ALREADY_SHARED_NEWS: {
    status_code: 200,
    code: 200,
    message: 'News already shared'
  },
  ALREADY_SHARED_VOICE: {
    status_code: 200,
    code: 200,
    message: 'Voice already shared'
  },
  ALREADY_SHARED_EVENT: {
    status_code: 200,
    code: 200,
    message: 'Event already shared'
  }
}
