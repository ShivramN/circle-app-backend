const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  eventTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/eventTemplateAPi',
      type: 'object',
      required: true,
      properties: {
        eventTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        },
        eventStartDate: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 10,
          pattern: __constants.VALIDATOR.dateFormat
        },
        eventEndDate: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 10,
          pattern: __constants.VALIDATOR.dateFormat
        },
        eventStartTime: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.time
        },
        eventEndTime: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.time
        },
        eventAddress: {
          type: 'string',
          required: true,
          minLength: 1
        },
        languageId: {
          type: 'array',
          required: true,
          items: {
            type: 'string',
            required: false,
            minLength: 1,
            maxLength: 50
          }
        },
        eventMinAge: {
          type: 'number',
          required: Boolean(request.isAgeCriteriaEnabled),
          minLength: 1,
          maxLength: 2
        },
        eventMaxAge: {
          type: 'number',
          required: Boolean(request.isAgeCriteriaEnabled),
          minLength: 1,
          maxLength: 2
        },
        eventSeat: {
          type: 'number',
          required: true,
          minLength: 1
        },
        eventCoinPoint: {
          type: 'number',
          required: true,
          minLength: 1
        },
        eventDescription: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 4000
        },
        eventHostName: {
          type: 'string',
          required: true,
          minLength: 0,
          maxLength: 50
        },
        invitePeople: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: __constants.EVENT_INVITE_TYPE
        },
        invitePeopleUserId: {
          type: 'array',
          required: Boolean(request.invitePeople && (request.invitePeople === __constants.EVENT_INVITE_TYPE[0])),
          minItems: 1,
          maxItem: 100,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 50
          }
        },
        eventThumbnail: {
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
          },
          eventMoreUrl: {
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
        eventAddTerms: {
          type: 'string',
          required: true,
          minLength: 0,
          maxLength: 4000
        },
        eventSpecialNote: {
          type: 'string',
          required: true,
          minLength: 0,
          maxLength: 4000
        },
        categoryId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        isAgeCriteriaEnabled: {
          type: 'boolean',
          required: true
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/eventTemplateAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (request && (request.invitePeopleUserId !== undefined) && (request.invitePeople !== __constants.EVENT_INVITE_TYPE[0])) {
      formatedError.push('invitePeopleUserId not required')
    }
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      request.invitePeopleCount = request.invitePeople === __constants.EVENT_INVITE_TYPE[0] ? request.invitePeopleUserId.length : -1
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  eventUpdateTemplate (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/eventUpdateTemplateAPi',
      type: 'object',
      required: true,
      properties: {
        eventId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        eventTitle: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        },
        eventStartDate: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 10,
          pattern: __constants.VALIDATOR.dateFormat
        },
        eventEndDate: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 10,
          pattern: __constants.VALIDATOR.dateFormat
        },
        eventStartTime: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.time
        },
        eventEndTime: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.time
        },
        isAgeCriteriaEnabled: {
          type: 'boolean',
          required: true
        },
        eventAddress: {
          type: 'string',
          required: true,
          minLength: 1
        },
        languageId: {
          type: 'array',
          required: true,
          items: {
            type: 'string',
            required: false,
            minLength: 1,
            maxLength: 50
          }
        },
        eventMinAge: {
          type: 'number',
          required: Boolean(request.isAgeCriteriaEnabled),
          minLength: 1,
          maxLength: 2
        },
        eventMaxAge: {
          type: 'number',
          required: Boolean(request.isAgeCriteriaEnabled),
          minLength: 1,
          maxLength: 2
        },
        eventSeat: {
          type: 'number',
          required: true,
          minLength: 1
        },
        eventCoinPoint: {
          type: 'number',
          required: true,
          minLength: 1
        },
        eventDescription: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 4000
        },
        eventHostName: {
          type: 'string',
          required: true,
          minLength: 0,
          maxLength: 50
        },
        invitePeople: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: __constants.EVENT_INVITE_TYPE
        },
        invitePeopleUserId: {
          type: 'array',
          required: Boolean(request.invitePeople && (request.invitePeople === __constants.EVENT_INVITE_TYPE[0])),
          minItems: 1,
          maxItems: 100,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 50
          }
        },
        eventThumbnail: {
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
        },
        eventMoreUrl: {
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
        eventAddTerms: {
          type: 'string',
          required: true,
          minLength: 0,
          maxLength: 4000
        },
        eventSpecialNote: {
          type: 'string',
          required: true,
          minLength: 0,
          maxLength: 4000
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
    v.addSchema(schema, '/eventUpdateTemplateAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (request && (request.invitePeopleUserId !== undefined) && (request.invitePeople !== __constants.EVENT_INVITE_TYPE[0])) {
      formatedError.push('invitePeopleUserId not required')
    }
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      request.invitePeopleCount = request.invitePeople === __constants.EVENT_INVITE_TYPE[0] ? request.invitePeopleUserId.length : -1
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
        },
        filterEvent: {
          type: 'string',
          required: true,
          enum: __constants.EVENT_LIST_FILTER

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
      id: '/checkPaginationApi',
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
          required: false,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkPaginationApi')
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

  checkEventId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkEventId',
      type: 'object',
      required: true,
      properties: {
        eventId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkEventId')
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

  checkInviteUser (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkPaginationApi',
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
        searchField: {
          type: 'string',
          required: false
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkPaginationApi')
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

  checkShareEvent (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkShareEvent',
      type: 'object',
      required: true,
      properties: {
        eventId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        sharedUserId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
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

  valEventList (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/valEventList',
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
        filterEvent: {
          type: 'string',
          required: true,
          enum: __constants.EVENT_LIST_FILTER

        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/valEventList')
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

  idWithPagination (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/idWithPagination',
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
        eventId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/idWithPagination')
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
