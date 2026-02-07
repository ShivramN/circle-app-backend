const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  filterValid (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/filterValidAPi',
      type: 'object',
      required: true,
      properties: {
        userId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        searchUser: {
          type: 'string',
          required: false,
          minLength: 1,
          maxLength: 50
        },
        limit: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.number
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/filterValidAPi')
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

  filterMedia (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/filterMedia',
      type: 'object',
      required: true,
      properties: {
        sortType: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: __constants.SORT_TYPE
        },
        mediaType: {
          type: 'string',
          required: false,
          minLength: 1,
          enum: __constants.MEDIA_TYPE
        },
        limit: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.number
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/filterMedia')
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

  filterRedeem (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/filterRedeem',
      type: 'object',
      required: true,
      properties: {
        sortType: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: __constants.SORT_TYPE
        },
        subType: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: __constants.SUB_TYPE
        },
        limit: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.number
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/filterRedeem')
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

  settingVal (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/settingVal',
      type: 'object',
      required: true,
      properties: {
        sharedNews: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        },
        sharedVoice: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        },
        sharedEvent: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        },
        eventAlert: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        },
        tagVoice: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        },
        eventInvited: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        },
        userFollow: {
          type: 'number',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/settingVal')
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
}

module.exports = validate
