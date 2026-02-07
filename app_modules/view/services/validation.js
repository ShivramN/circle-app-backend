const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  viewValidation (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/viewValidation',
      type: 'object',
      required: true,
      properties: {
        [__constants.MEDIA_TYPE[0]]: {
          type: 'array',
          required: false,
          minItems: 1,
          items: {
            type: 'object',
            required: true,
            properties: {
              newsId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              newsCategoryId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              newsOwnerId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              timeInSec: {
                type: 'number',
                required: true,
                minLength: 1,
                maxLength: 50
              }
            }
          }
        },
        [__constants.MEDIA_TYPE[1]]: {
          type: 'array',
          required: false,
          minItems: 1,
          items: {
            type: 'object',
            required: true,
            properties: {
              voiceId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              voiceCategoryId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              voiceOwnerId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              timeInSec: {
                type: 'number',
                required: true,
                minLength: 1,
                maxLength: 50
              }
            }
          }
        },
        [__constants.MEDIA_TYPE[2]]: {
          type: 'array',
          required: false,
          minItems: 1,
          items: {
            type: 'object',
            required: true,
            properties: {
              eventId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              eventCategoryId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              eventOwnerId: {
                type: 'string',
                required: true,
                minLength: 1,
                maxLength: 50
              },
              timeInSec: {
                type: 'number',
                required: true,
                minLength: 1,
                maxLength: 50
              }
            }
          }
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/viewValidation')
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

  filter (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/filter',
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
        mediaType: {
          type: 'string',
          required: false,
          minLength: 1,
          pattern: __constants.VALIDATOR.MEDIA_TYPE
        }
      }
    }
    const formatedError = []
    v.addSchema(schema, '/filter')
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
