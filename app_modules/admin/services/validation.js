const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  signup (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/signupApi',
      type: 'object',
      required: true,
      properties: {
        email: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100,
          format: 'email'
        },
        password: {
          type: 'string',
          required: true,
          minLength: 6,
          maxLength: 50
        },
        fullName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/signupApi')
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

  login (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/loginAPi',
      type: 'object',
      required: true,
      properties: {
        email: {
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
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  addCategory (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/addCategoryAPi',
      type: 'object',
      required: true,
      properties: {
        categoryName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        categoryDescription: {
          type: 'string',
          required: true,
          minLength: 1
        },
        categoryImage: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 250
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/addCategoryAPi')
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

  updateCategory (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/updateCategoryAPi',
      type: 'object',
      required: true,
      properties: {
        categoryName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        categoryId: {
          type: 'string',
          required: false,
          minLength: 1,
          maxLength: 50
        },
        categoryDescription: {
          type: 'string',
          required: true,
          minLength: 1
        },
        categoryImage: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 250
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/updateCategoryAPi')
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

  updateApplePay (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/updateApplePay',
      type: 'object',
      required: true,
      properties: {
        appleIAPStatus: {
          type: 'boolean',
          required: true
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/updateApplePay')
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

  categoryId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/deleteCategoryAPi',
      type: 'object',
      required: true,
      properties: {
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
    v.addSchema(schema, '/deleteCategoryAPi')
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

  addSubcription (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/addSubcriptionAPi',
      type: 'object',
      required: true,
      properties: {
        planIcon: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 250
        },
        planName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        planTitle: {
          type: 'string',
          required: true,
          minLength: 1
        },
        planPrice: {
          type: 'numer',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        planDiscountPrice: {
          type: 'numer',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        planDescription: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 1000
          }
        },
        planDaysDetails: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        },
        planTotalDays: {
          type: 'numer',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        viewVoice: {
          type: 'boolean',
          required: true
        },
        addVoice: {
          type: 'boolean',
          required: true
        },
        viewNews: {
          type: 'boolean',
          required: true
        },
        addNews: {
          type: 'boolean',
          required: true
        },
        viewEvent: {
          type: 'boolean',
          required: true
        },
        addEvent: {
          type: 'boolean',
          required: true
        },
        viewAchievement: {
          type: 'boolean',
          required: true
        },
        spendAchievement: {
          type: 'boolean',
          required: true
        },
        applyCelebrity: {
          type: 'boolean',
          required: true
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/addSubcriptionAPi')
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

  updateSubcription (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/updateSubcriptionAPi',
      type: 'object',
      required: true,
      properties: {
        planIcon: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 250
        },
        planId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        planName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        planTitle: {
          type: 'string',
          required: true,
          minLength: 1
        },
        planPrice: {
          type: 'numer',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        planDiscountPrice: {
          type: 'numer',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        planDescription: {
          type: 'array',
          required: true,
          minLength: 1,
          items: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 1000
          }
        },
        planDaysDetails: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100
        },
        planTotalDays: {
          type: 'numer',
          required: true,
          minLength: 1,
          maxLength: 10
        },
        viewVoice: {
          type: 'boolean',
          required: true
        },
        addVoice: {
          type: 'boolean',
          required: true
        },
        viewNews: {
          type: 'boolean',
          required: true
        },
        addNews: {
          type: 'boolean',
          required: true
        },
        viewEvent: {
          type: 'boolean',
          required: true
        },
        addEvent: {
          type: 'boolean',
          required: true
        },
        viewAchievement: {
          type: 'boolean',
          required: true
        },
        spendAchievement: {
          type: 'boolean',
          required: true
        },
        applyCelebrity: {
          type: 'boolean',
          required: true
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/updateSubcriptionAPi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if ((request.planName.toLowerCase() === Object.keys(__constants.SUBSCRIPTION)[1]) && (request.planId !== __constants.SUBSCRIPTION.basic)) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Plan name cannot be "basic"' })
    }
    if ((request.planName.toLowerCase() !== Object.keys(__constants.SUBSCRIPTION)[1]) && (request.planId === __constants.SUBSCRIPTION.basic)) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: 'Unable to modify the basic plan name' })
    }
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError[0] })
    } else {
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }

  deActive (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/deletePlanAPi',
      type: 'object',
      required: true,
      properties: {
        planId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        isActive: {
          type: 'string',
          required: true,
          pattern: __constants.VALIDATOR.booleanValue

        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/deletePlanAPi')
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

  planId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/deletePlanAPi',
      type: 'object',
      required: true,
      properties: {
        planId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/deletePlanAPi')
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

  resetPwd (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/resetPwd',
      type: 'object',
      required: true,
      properties: {
        oldPassword: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.password
        },
        newPassword: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.password
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/resetPwd')
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

  pagination (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/pagination',
      type: 'object',
      required: true,
      properties: {
        limit: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.number
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/pagination')
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

  filters (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/filters',
      type: 'object',
      required: true,
      properties: {
        limit: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.number
        },
        page: {
          type: 'string',
          required: true,
          minLength: 1,
          pattern: __constants.VALIDATOR.number
        },
        filterKey: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: __constants.VERIFIED_STATUS
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/filters')
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
        },
        celebrityStatus: {
          type: 'string',
          required: true,
          minLength: 1,
          enum: [__constants.VERIFIED_STATUS[1], __constants.VERIFIED_STATUS[2]]
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

  valUserId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/valUserId',
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
    v.addSchema(schema, '/valUserId')
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

  valLanguageId (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/valLanguageId',
      type: 'object',
      required: true,
      properties: {
        languageId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/valLanguageId')
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

  addLanguage (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/addLanguage',
      type: 'object',
      required: true,
      properties: {
        languageName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        languageCode: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 3
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/addLanguage')
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

  updateLangauge (request) {
    const isvalid = q.defer()
    const schema = {
      id: '/addLanguage',
      type: 'object',
      required: true,
      properties: {
        languageId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        languageName: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        },
        languageCode: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 3
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/addLanguage')
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
