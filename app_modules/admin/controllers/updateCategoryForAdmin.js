const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const updateCategoryForAdmin = (req, res) => {
  __logger.info('Inside updateCategoryForAdmin')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.updateCategory(req.body)
    .then(data => {
      return userService.checkByCategoryId(req.body.categoryId)
    })
    .then(data => {
      __logger.info('updateCategory :: then 1')
      return userService.updateCategory(req.body.categoryId, req.body, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'category update successfully' })
    })
    .catch(err => {
      __logger.error('error: updateCategoryForAdmin function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = updateCategoryForAdmin
