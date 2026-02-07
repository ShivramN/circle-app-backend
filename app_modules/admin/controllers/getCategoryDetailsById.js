const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const getCategoryDetailsById = (req, res) => {
  __logger.info('Inside getCategoryDetailsById')
  const validate = new ValidationService()
  const userService = new Service()
  validate.categoryId(req.params)
    .then(data => {
      return userService.checkByCategoryId(req.params.categoryId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: data[0] })
    })
    .catch(err => {
      __logger.error('error: getCategoryDetailsById function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = getCategoryDetailsById
