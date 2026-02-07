const q = require('q')
const _ = require('lodash')
const Validator = require('jsonschema').Validator
const v = new Validator()
const __constants = require('../../../config/constants')
const TrimService = require('../../../lib/trimService/trim')
const trimInput = new TrimService()

class validate {
  checkFollowId (request, userId) {
    const isvalid = q.defer()
    const schema = {
      id: '/checkFollowIdApi',
      type: 'object',
      required: true,
      properties: {
        followingId: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50
        }
      },
      additionalProperties: false
    }
    const formatedError = []
    v.addSchema(schema, '/checkFollowIdApi')
    const error = _.map(v.validate(request, schema).errors, 'stack')
    _.each(error, function (err) {
      const formatedErr = err.split('.')
      formatedError.push(formatedErr[formatedErr.length - 1])
    })
    if (formatedError.length > 0) {
      isvalid.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_REQUEST, err: formatedError })
    } else {
      if (userId === request.followingId) {
        isvalid.reject({ type: __constants.RESPONSE_MESSAGES.USERID_SAME, err: __constants.RESPONSE_MESSAGES.USERID_SAME.message })
      }
      trimInput.singleInputTrim(request)
      isvalid.resolve(request)
    }
    return isvalid.promise
  }
}
module.exports = validate
