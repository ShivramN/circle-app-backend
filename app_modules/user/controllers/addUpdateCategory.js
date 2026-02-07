const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const UserService = require('../services/dbData')
const CategoryService = require('../../admin/services/dbData')

const addUpdateCategory = (req, res) => {
  __logger.info('Inside addUpdateCategory')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const oldCategoryId = req.userConfig && req.userConfig.categoryId.length > 0 ? req.userConfig.categoryId : ['']
  let newCategoryId
  let showUserList
  const validation = new Validation()
  const userservice = new UserService()
  const categoryService = new CategoryService()
  validation.checkCategoryId(req.body)
    .then(data => {
      return categoryService.checkByOnlyCategoryId(req.body.categoryId)
    })
    .then(data => {
      showUserList = Boolean(!data.followersCount)
      newCategoryId = data && data.categoryId ? data.categoryId.split(',') : []
      return userservice.insertUpdateCategory(userId, newCategoryId)
    })
    .then(data => {
      return categoryService.updateCategoryCount(newCategoryId, oldCategoryId)
    })
    .then(data => {
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: { showUserList } })
    })
    .catch(err => {
      __logger.error('error in getCategory function: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = addUpdateCategory
