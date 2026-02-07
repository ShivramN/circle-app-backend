const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const Service = require('../services/dbData')

const deleteCategoryForAdmin = (req, res) => {
  __logger.info('Inside deleteCategoryForAdmin')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new ValidationService()
  const userService = new Service()
  validate.categoryId(req.params)
    .then(data => {
      return userService.checkByCategoryId(req.params.categoryId)
    })
    .then(data => {
      __logger.info('deleteCategoryForAdmin :: then 1')
      return userService.deleteCategory(req.params.categoryId, userId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'delete category successfully' })
    })
    .catch(err => {
      __logger.error('error: deleteCategoryForAdmin function ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = deleteCategoryForAdmin
