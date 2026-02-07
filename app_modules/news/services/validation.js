const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  newsTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/newsTemplateAPi',
      type: 'object',
      required: true,
      properties: {
        newsTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        },
        newsDescription: {
          type: 'string',
          required: true,
          minLength: 1
        },
        newsUrl: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'object',
            required: true,
            minItems: 1,
            maxItems: 10,
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
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        newsBanner: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'object',
            required: true,
            minItems: 1,
            maxItems: 10,
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
              },
              type: {
                type: 'string',
                required: true,
                enum: __constants.IMAGE_TYPE
              }
            }
          }
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/newsTemplateAPi')
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

  newsUpdateTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/newsUpdateTemplateAPi',
      type: 'object',
      required: true,
      properties: {
        newsId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        newsTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        },
        newsDescription: {
          type: 'string',
          required: true,
          minLength: 1
        },
        newsUrl: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'object',
            required: true,
            minItems: 1,
            maxItems: 10,
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
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        newsBanner: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'object',
            required: true,
            minItems: 1,
            maxItems: 10,
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
              },
              type: {
                type: 'string',
                required: true,
                enum: __constants.IMAGE_TYPE
              }
            }
          }
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/newsUpdateTemplateAPi')
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
          required: true,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: true,
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

  checkNewsId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkNewsId',
      type: 'object',
      required: true,
      properties: {
        newsId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkNewsId')
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

  checkShareNews (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkShareNews',
      type: 'object',
      required: true,
      properties: {
        newsId: {
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
    v.addSchema(schema, '/checkShareNews')
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
}

module.exports = validate
