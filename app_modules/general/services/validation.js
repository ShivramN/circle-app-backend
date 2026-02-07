const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
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
    v.addSchema(schema, '/updateCategoryAPi')
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
