const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  voiceTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/voiceTemplateAPi',
      type: 'object',
      required: true,
      properties: {
        voiceTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 5000
        },
        voiceUrl: {
          type: 'array',
          required: false,
          maxItems: 1,
          items: {
            type: 'object',
            required: true,
            maxItems: 1,
            properties: {
              url: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 250
              },
              mimeType: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 250
              }
            }
          }
        },
        voicePlaform: {
          type: 'array',
          required: false,
          maxItems: 10,
          items: {
            type: 'object',
            required: true,
            properties: {
              mediaPlatform: {
                type: 'string',
                required: true,
                minLength: 1,
                enum: __constants.SOCIAL_MEDIA

              },
              url: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 250
              }
            }
          }
        },
        tagUserId: {
          type: 'array',
          required: false,
          minLength: 1,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 50
          }
        },
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/voiceTemplateAPi')
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

  voiceUpdateTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/voiceUpdateTemplateAPi',
      type: 'object',
      required: true,
      properties: {
        voiceId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        voiceTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 5000
        },
        voiceUrl: {
          type: 'array',
          required: false,
          minLength: 1,
          items: {
            type: 'object',
            required: true,
            maxItems: 1,
            properties: {
              url: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 250
              },
              mimeType: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 250
              }
            }
          }
        },
        voicePlaform: {
          type: 'array',
          required: false,
          maxItems: 10,
          items: {
            type: 'object',
            required: true,
            properties: {
              mediaPlatform: {
                type: 'string',
                required: true,
                minLength: 1,
                enum: __constants.SOCIAL_MEDIA

              },
              url: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 250
              }
            }
          }
        },
        tagUserId: {
          type: 'array',
          required: false,
          minLength: 1,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 50
          }
        },
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/voiceUpdateTemplateAPi')
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

  checkFollowerId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkFollowerId',
      type: 'object',
      required: true,
      properties: {
        followerId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        limit: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkFollowerId')
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

  checkPagination (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkFollowerId',
      type: 'object',
      required: true,
      properties: {
        limit: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: false,
          pattern: __constants.VALIDATOR.number
        },
        categoryId: {
          type: 'string',
          request: false,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkFollowerId')
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

  checkVoiceId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkVoiceId',
      type: 'object',
      required: true,
      properties: {
        voiceId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkVoiceId')
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

  checkShareVoice (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkShareEvent',
      type: 'object',
      required: true,
      properties: {
        voiceId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        sharedUserId: {
          type: 'array',
          required: true,
          minItems: 1,
          maxItems: 100,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 50
          }
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkShareEvent')
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

  valPagination (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/valPagination',
      type: 'object',
      required: true,
      properties: {
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
    v.addSchema(schema, '/valPagination')
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

  valPaginationWithUserId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/valPaginationWithUserId',
      type: 'object',
      required: true,
      properties: {
        limit: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.number
        },
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
    v.addSchema(schema, '/valPaginationWithUserId')
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
