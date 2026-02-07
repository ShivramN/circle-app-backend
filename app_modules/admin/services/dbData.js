const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const userProvider = require('../../user/queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const UserVerfication = require('../../user/services/verification')
const __logger = require('../../../lib/logger')

class Admin {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  checkByCategoryId (categoryId) {
    __logger.info('dbData: checkByCategoryId(): ')
    const doesCheckByCategoryId = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkCategory(), [categoryId])
      .then(result => {
        __logger.info('dbData: checkByCategoryId(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckByCategoryId.resolve(result)
        } else {
          doesCheckByCategoryId.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by category id exists function: ', err)
        doesCheckByCategoryId.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckByCategoryId.promise
  }

  checkByCategoryName (categoryDetails) {
    __logger.info('dbData: checkByCategoryId(): ')
    const doesCheckByCategoryName = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkCategoryDetails(), [categoryDetails.categoryName, categoryDetails.categoryDescription, categoryDetails.categoryImage])
      .then(result => {
        __logger.info('dbData: checkByCategoryId(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckByCategoryName.reject({ type: __constants.RESPONSE_MESSAGES.CATEGORY_EXISTS, err: __constants.RESPONSE_MESSAGES.CATEGORY_EXISTS.message })
        } else {
          doesCheckByCategoryName.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by category id exists function: ', err)
        doesCheckByCategoryName.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckByCategoryName.promise
  }

  insertCategory (categoryDetails, userId) {
    __logger.info('dbData: insertCategory(): ')
    const doesInsertCategory = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.addCategory(), [this.uniqueId.uuid(), categoryDetails.categoryName, categoryDetails.categoryDescription, categoryDetails.categoryImage, userId])
      .then(result => {
        __logger.info('dbData: insertCategory(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesInsertCategory.resolve(result)
        } else {
          doesInsertCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert category function: ', err)
        doesInsertCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertCategory.promise
  }

  updateCategory (categoryId, categoryDetails, userId) {
    __logger.info('dbData: updateCategory(): ', categoryId, categoryDetails)
    const doesUpdateCategory = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateCategory(), [categoryDetails.categoryName, categoryDetails.categoryDescription, categoryDetails.categoryImage, userId, categoryId])
      .then(result => {
        __logger.info('dbData: updateCategory(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateCategory.resolve(result)
        } else {
          doesUpdateCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update category function: ', err)
        doesUpdateCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateCategory.promise
  }

  updateCategoryCount (newCategoryId, oldCategoryId) {
    __logger.info('dbData: updateCategoryCount(): ', newCategoryId, oldCategoryId)
    const doesUpdateCategoryCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateFollowCount(oldCategoryId), [newCategoryId, oldCategoryId])
      .then(result => {
        __logger.info('dbData: updateCategoryCount(): then 1:', result)
        if (result && result[0] && result[0].affectedRows > 0) {
          doesUpdateCategoryCount.resolve(result)
        } else {
          doesUpdateCategoryCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  update Category Count function: ', err)
        doesUpdateCategoryCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateCategoryCount.promise
  }

  checkByOnlyCategoryId (categoryId) {
    __logger.info('dbData: checkByOnlyCategoryId(): ', categoryId)
    const doesCheckByOnlyCategoryId = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getCategoryByCategoryId(), [categoryId])
      .then(result => {
        __logger.info('dbData: checkByOnlyCategoryId(): then 1:', result)
        if (result && result[0]) {
          doesCheckByOnlyCategoryId.resolve(result[0])
        } else {
          doesCheckByOnlyCategoryId.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by Category Id function: ', err)
        doesCheckByOnlyCategoryId.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckByOnlyCategoryId.promise
  }

  deleteCategory (categoryId, userId) {
    __logger.info('dbData: deleteCategory(): ', categoryId)
    const doesDeleteCategory = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteCategory(), [0, userId, categoryId])
      .then(result => {
        __logger.info('dbData: deleteCategory(): then 1:', result)
        if (result && result && result.affectedRows > 0) {
          doesDeleteCategory.resolve(result)
        } else {
          doesDeleteCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in delete by Category Id function: ', err)
        doesDeleteCategory.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteCategory.promise
  }

  checkSubcription (planDetails) {
    __logger.info('dbData: checkSubcription(): ')
    const doesCheckSubcription = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkPlan(), [planDetails.planName, planDetails.viewVoice, planDetails.addVoice, planDetails.viewNews, planDetails.viewEvent, planDetails.addNews, planDetails.addEvent, planDetails.viewAchievement, planDetails.spendAchievement, planDetails.applyCelebrity, planDetails.planTitle, planDetails.planDiscountPrice, planDetails.planPrice, planDetails.planIcon, planDetails.planDaysDetails, planDetails.planDescription, planDetails.planTotalDays])
      .then(result => {
        __logger.info('dbData: checkSubcription(): then 1:', result)
        if ((result && (result.length > 0)) || (planDetails.planName.toLowerCase() === Object.keys(__constants.SUBSCRIPTION)[1])) {
          doesCheckSubcription.reject({ type: __constants.RESPONSE_MESSAGES.PLAN_EXISTS, err: __constants.RESPONSE_MESSAGES.PLAN_EXISTS.message })
        } else {
          doesCheckSubcription.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by check Subcription exists function: ', err)
        doesCheckSubcription.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckSubcription.promise
  }

  getAdminDetails (email) {
    __logger.info('dbData: getAdminDetails(): ')
    const doesGetAdminDetails = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getAdminDetails(), [email])
      .then(result => {
        __logger.info('dbData: getAdminDetails(): then 1:', result)
        if (result && result.length > 0) {
          doesGetAdminDetails.resolve(result)
        } else {
          doesGetAdminDetails.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get admin details function: ', err)
        doesGetAdminDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetAdminDetails.promise
  }

  insertPlan (planDetails, userId) {
    __logger.info('dbData: insertPlan(): ')
    const doesInsertPlan = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertPlan(), [this.uniqueId.uuid(), planDetails.planName, planDetails.viewVoice, planDetails.addVoice, planDetails.viewNews, planDetails.viewEvent, planDetails.addNews, planDetails.addEvent, planDetails.viewAchievement, planDetails.spendAchievement, planDetails.applyCelebrity, planDetails.planTitle, planDetails.planDiscountPrice, planDetails.planPrice, planDetails.planIcon, planDetails.planDaysDetails, planDetails.planDescription, planDetails.planTotalDays, userId])
      .then(result => {
        __logger.info('dbData: insertPlan(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesInsertPlan.resolve(result)
        } else {
          doesInsertPlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert category function: ', err)
        doesInsertPlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertPlan.promise
  }

  checkByPlanId (planId, isActive = false) {
    __logger.info('dbData: checkByPlanId(): ', planId)
    const doesCheckByPlanId = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkPlanDetail(isActive), [planId])
      .then(result => {
        __logger.info('dbData: checkByPlanId(): then 1:', result)
        if ((result && result.length > 0)) {
          doesCheckByPlanId.resolve(result)
        } else {
          doesCheckByPlanId.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_PLAN, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_PLAN.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by plan id function: ', err)
        doesCheckByPlanId.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckByPlanId.promise
  }

  updateSubcription (planDetails, userId) {
    __logger.info('dbData: updateSubcription(): ')
    const doesUpdateSubcription = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateSubcription(), [planDetails.planName, planDetails.viewVoice, planDetails.addVoice, planDetails.viewNews, planDetails.viewEvent, planDetails.addNews, planDetails.addEvent, planDetails.viewAchievement, planDetails.spendAchievement, planDetails.applyCelebrity, planDetails.planTitle, planDetails.planDiscountPrice, planDetails.planPrice, planDetails.planIcon, planDetails.planDaysDetails, planDetails.planDescription, planDetails.planTotalDays, userId, planDetails.planId])
      .then(result => {
        __logger.info('dbData: updateSubcription(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateSubcription.resolve(result)
        } else {
          doesUpdateSubcription.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert category function: ', err)
        doesUpdateSubcription.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateSubcription.promise
  }

  deletePlan (planId, isActive, userId) {
    __logger.info('dbData: deletePlan(): ', planId)
    const doesDeletePlan = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deletePlan(), [parseInt(isActive), userId, planId])
      .then(result => {
        __logger.info('dbData: deletePlan(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesDeletePlan.resolve(result)
        } else {
          doesDeletePlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in delete by plan Id function: ', err)
        doesDeletePlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeletePlan.promise
  }

  getAdminDetailsById (userId) {
    __logger.info('dbData: getAdminDetailsById(): ')
    const doesGetAdminDetailsById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getAdminDetailsById(), [userId])
      .then(result => {
        __logger.info('dbData: getAdminDetailsById(): then 1:', result)
        if (result && result.length > 0) {
          doesGetAdminDetailsById.resolve(result)
        } else {
          doesGetAdminDetailsById.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get admin details function: ', err)
        doesGetAdminDetailsById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetAdminDetailsById.promise
  }

  updatePassword (newPwd, userId) {
    __logger.info('dbData: updatePassword(): ', newPwd)
    const doesUpdatePassword = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updatePassword(), [newPwd, userId, userId])
      .then(result => {
        __logger.info('dbData: updatePassword(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdatePassword.resolve(result)
        } else {
          doesUpdatePassword.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update admin pwd details function: ', err)
        doesUpdatePassword.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdatePassword.promise
  }

  getUserList (limit, offset) {
    __logger.info('dbData: getUserList(): ')
    const doesgetUserList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserList(), [limit, offset])
      .then(result => {
        if (result && result[0].length > 0) {
          doesgetUserList.resolve(result)
        } else {
          doesgetUserList.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get user list function: ', err)
        doesgetUserList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesgetUserList.promise
  }

  getDetailById (userId) {
    __logger.info('dbData: getDetailById(): ', userId)
    const doesgetDetailById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getDetailById(), [userId])
      .then(result => {
        if (result && result.length > 0) {
          doesgetDetailById.resolve(result[0])
        } else {
          doesgetDetailById.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get user list function: ', err)
        doesgetDetailById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesgetDetailById.promise
  }

  getCelebrityUserList (filterKey, limit, offset) {
    __logger.info('dbData: getCelebrityUserList(): ', filterKey, limit, offset)
    let value
    if (filterKey === __constants.VERIFIED_STATUS[3]) value = __constants.VERIFIED_STATUS
    else value = filterKey
    const doesGetCelebrityUserList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getCelebrityUserList(), [value, limit, offset, value])
      .then(result => {
        if (result && result[0].length > 0) {
          doesGetCelebrityUserList.resolve(result)
        } else {
          doesGetCelebrityUserList.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get celebrity user list function: ', err)
        doesGetCelebrityUserList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetCelebrityUserList.promise
  }

  getUserDeatils (userId) {
    __logger.info('dbData: getUserDeatils(): ', userId)
    const doesGetUserDeatils = q.defer()
    const userVerfication = new UserVerfication()
    __db.mysql.query(__constants.MYSQL_NAME, userProvider.userDetails(), [userId])
      .then(result => {
        if (result && result.length > 0) {
          __logger.info('dbData: getUserDeatils(): then 1:', result)
          doesGetUserDeatils.resolve(userVerfication.sendCelebrityByEmail(result[0].fullName, result[0].email))
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update details user function: ', err)
        doesGetUserDeatils.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetUserDeatils.promise
  }

  updateCelebrityStatus (userId, celebrityStatus, adminUserId) {
    __logger.info('dbData: updateCelebrityStatus(): ', userId, adminUserId)
    const isCelebrity = celebrityStatus === __constants.VERIFIED_STATUS[2] ? 1 : 0
    const doesUpdateCelebrityStatus = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateCelebrityStatus(), [celebrityStatus, adminUserId, isCelebrity, userId])
      .then(result => {
        if (celebrityStatus === __constants.VERIFIED_STATUS[2]) {
          this.getUserDeatils(userId)
        }
        __logger.info('dbData: updateCelebrityStatus(): then 1:', result)
        doesUpdateCelebrityStatus.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in update celebrity user function: ', err)
        doesUpdateCelebrityStatus.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateCelebrityStatus.promise
  }

  getCategoryForAdmin (limit, offset) {
    __logger.info('dbData: getCategoryForAdmin(): ', limit, offset)
    const doesGetCategoryForAdmin = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getCategorywithPostAndFollower(), [limit, offset])
      .then(data => {
        if (data && data[0].length > 0) {
          doesGetCategoryForAdmin.resolve(data)
        } else {
          doesGetCategoryForAdmin.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_CATEGORY.message })
        }
      })
      .catch(err => {
        __logger.error('error in getCategoryForAdmin function: ', err)
        doesGetCategoryForAdmin.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetCategoryForAdmin.promise
  }

  getLanguageById (languageId) {
    __logger.info('dbData: getLanguageById(): ', languageId)
    const doesGetLanguageById = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getLanguageById(), [languageId])
      .then(result => {
        __logger.info('dbData: getLanguageById(): then 1:', result)
        if (result && result.length > 0) {
          doesGetLanguageById.resolve(result[0])
        } else {
          doesGetLanguageById.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_LANGUAGE, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND_FOR_LANGUAGE.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by language id function: ', err)
        doesGetLanguageById.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetLanguageById.promise
  }

  checkLanguage (languageDetails) {
    __logger.info('dbData: checkLanguage(): ')
    const doesCheckLanguage = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.checkLanguage(), [languageDetails.languageName, languageDetails.languageCode])
      .then(result => {
        __logger.info('dbData: checkLanguage(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckLanguage.reject({ type: __constants.RESPONSE_MESSAGES.LANGUAGE_EXISTS, err: __constants.RESPONSE_MESSAGES.LANGUAGE_EXISTS.message })
        } else {
          doesCheckLanguage.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check by check language exists function: ', err)
        doesCheckLanguage.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckLanguage.promise
  }

  insertLanguage (languageDetails, userId) {
    __logger.info('dbData: insertLanguage(): ')
    const doesInsertLanguage = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertLanguage(), [this.uniqueId.uuid(), languageDetails.languageName, languageDetails.languageCode, userId])
      .then(result => {
        __logger.info('dbData: insertLanguage(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesInsertLanguage.resolve(result)
        } else {
          doesInsertLanguage.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert language function: ', err)
        doesInsertLanguage.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertLanguage.promise
  }

  updateLanguage (languageDetails, userId) {
    __logger.info('dbData: updateLanguage(): ')
    const doesUpdateLanguage = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateLanguage(), [languageDetails.languageName, languageDetails.languageCode, userId, languageDetails.languageId])
      .then(result => {
        __logger.info('dbData: updateLanguage(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateLanguage.resolve(result)
        } else {
          doesUpdateLanguage.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in insert language function: ', err)
        doesUpdateLanguage.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateLanguage.promise
  }

  deleteLangauge (languageId, userId) {
    __logger.info('dbData: deleteLangauge(): ', languageId)
    const doesDeleteLangauge = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteLangauge(), [0, userId, languageId])
      .then(result => {
        __logger.info('dbData: deleteLangauge(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesDeleteLangauge.resolve(result)
        } else {
          doesDeleteLangauge.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in delete by language Id function: ', err)
        doesDeleteLangauge.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteLangauge.promise
  }

  updateApplePay (applePay, userId) {
    __logger.info('dbData: updateApplePay(): ', applePay)
    const doesUpdateApplePay = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateApplePay(), [applePay, userId, 'appleIAPStatus'])
      .then(result => {
        __logger.info('dbData: updateApplePay(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateApplePay.resolve(result)
        } else {
          doesUpdateApplePay.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in update apple pay setting function: ', err)
        doesUpdateApplePay.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateApplePay.promise
  }
}

module.exports = Admin
