const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  forceUpdate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/forceUpdateAPi',
      type: 'object',
      required: true,
      properties: {
        iOSAppVersion: {
          type: 'number',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        osType: {
          type: 'string',
          required: true,
          enum: ['ios', 'android']
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/forceUpdateAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  login (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/loginAPi',
      type: 'object',
      required: true,
      properties: {
        emailOrUsername: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        password: {
          type: 'string',
          required: true,
          minLength: 1
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/loginAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  setUser (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/setUserApi',
      type: 'object',
      required: true,
      properties: {
        fullName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50,
          pattern: __constants.VALIDATOR.fullName
        },
        userId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        password: {
          type: 'string',
          required: false,
          minLength: 1,
          pattern: __constants.VALIDATOR.password
        },
        username: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50,
          pattern: __constants.VALIDATOR.username
        },
        gender: {
          type: 'string',
          required: false,
          enum: __constants.GENDER_TYPE
        },
        dateOfBirth: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.dateFormat
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/setUserApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      if (formatedErr[formatedErr.length - 1] && formatedErr[formatedErr.length - 1].includes('fullName does not match pattern')) {
        formatedError.push('Please enter a valid Full name')
      } else if (formatedErr[formatedErr.length - 1] && formatedErr[formatedErr.length - 1].includes('username does not match pattern')) {
        formatedError.push('Please enter a valid username')
      } else if (formatedErr[formatedErr.length - 1] && formatedErr[formatedErr.length - 1].includes('dateOfBirth does not match pattern')) {
        formatedError.push('Please select a valid date of birth')
      } else if (formatedErr[formatedErr.length - 1] && formatedErr[formatedErr.length - 1].includes('gender is not one of enum values: male,female,other')) {
        formatedError.push('Please select a valid gender')
      } else if (formatedErr[formatedErr.length - 1] && formatedErr[formatedErr.length - 1].includes('password does not match pattern')) {
        formatedError.push('Please enter a valid password')
      } else { formatedError.push(formatedErr[formatedErr.length - 1]) }
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  checkOtp (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkOtpApi',
      type: 'object',
      required: true,
      properties: {
        userId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        code: {
          type: 'number',
          required: true,
          minLength: 6,
          maxLength: 6
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkOtpApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  valSearchUser (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/valSearchUserApi',
      type: 'object',
      required: true,
      properties: {
        searchUser: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/valSearchUserApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  checkUserName (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkUserNameApi',
      type: 'object',
      required: true,
      properties: {
        username: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkUserNameApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  checkUserId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkUserIdApi',
      type: 'object',
      required: true,
      properties: {
        userId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkUserIdApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  generateUsername (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/generateUsernameApi',
      type: 'object',
      required: true,
      properties: {
        email: {
          type: 'string',
          required: true,
          minLength: 1
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/generateUsernameApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
        .then(data => isvalid.resolve(data))
    }
    return isvalid.promise
  }

  changePassword (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/changePassword',
      type: 'object',
      required: true,
      properties: {
        newPassword: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.password

        },
        oldPassword: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.password

        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/changePassword')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  checkCategoryId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkCategoryIdAPi',
      type: 'object',
      required: true,
      properties: {
        categoryId: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 50
          }
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkCategoryIdAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  resetPassword (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/resetPassword',
      type: 'object',
      required: true,
      properties: {
        newPassword: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.password

        },
        userId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        code: {
          type: 'number',
          required: true,
          minLength: 6,
          maxLength: 6
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/resetPassword')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      if (formatedErr[formatedErr.length - 1] && formatedErr[formatedErr.length - 1].includes('password does not match pattern')) {
        formatedError.push('Please enter a valid password')
      } else formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  checkUserProfile (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkUserProfile',
      type: 'object',
      required: true,
      properties: {
        fullName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50,
          pattern: __constants.VALIDATOR.fullName
        },
        gender: {
          type: 'string',
          required: false,
          enum: __constants.GENDER_TYPE
        },
        dateOfBirth: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.dateFormat
        },
        shortBio: {
          type: 'string',
          required: false,
          maxLength: 1000
        },
        occupation: {
          type: 'string',
          required: false,
          maxLength: 200
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkUserProfile')
    const error = _.map(v.validate(request, schema).errors, 'stack')

    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  checkUserInfo (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkUserInfo',
      type: 'object',
      required: true,
      properties: {
        phoneCode: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50,
          pattern: __constants.VALIDATOR.phoneCode
        },
        phoneNumber: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.phoneNumber
        },
        address: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 500
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkUserInfo')
    const error = _.map(v.validate(request, schema).errors, 'stack')

    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  checkToken (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/CheckToken',
      type: 'object',
      required: true,
      properties: {
        fcmToken: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 500
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/CheckToken')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  socialLogin (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/socialLogin',
      type: 'object',
      required: true,
      properties: {
        socialToken: {
          type: 'string',
          required: true,
          minLength: 1
        },
        type: {
          type: 'string',
          required: true,
          enum: __constants.SOCIAL_LOGIN_TYPE
        },
        email: {
          type: 'string',
          required: true,
          minLength: 1
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/socialLogin')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }
}

module.exports = validate
