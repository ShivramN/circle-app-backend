const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')

class Subcription {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  getListOfPlan () {
    __logger.info('dbData: getListOfPlan(): ')
    const doesGetPlanList = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getListOfPlan(), [__constants.SUBSCRIPTION.free_plan])
      .then(result => {
        __logger.info('dbData: getListOfPlan(): then 1:', result)
        if (result && result.length > 0) {
          doesGetPlanList.resolve(result)
        } else {
          doesGetPlanList.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get plan list function: ', err)
        doesGetPlanList.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetPlanList.promise
  }

  checkPlan (planId, isActive = false) {
    __logger.info('dbData: checkPlan(): ')
    const doesCheckPlan = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getPlanListById(isActive), [planId])
      .then(result => {
        __logger.info('dbData: checkPlan(): then 1:', result)
        if (result && result.length > 0) {
          doesCheckPlan.resolve(result[0])
        } else {
          doesCheckPlan.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in check plan function: ', err)
        doesCheckPlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckPlan.promise
  }

  insertTransaction (userId, planId) {
    __logger.info('insertTransaction:', userId)
    const doesInsertTransaction = q.defer()
    const transactionId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertTransaction(), [transactionId, planId, userId])
      .then(result => {
        __logger.info('dbData: insertTransaction(): then 1:', result, planId)
        if (result && result.affectedRows === 1) {
          doesInsertTransaction.resolve(planId)
        } else {
          doesInsertTransaction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('insertTransaction :: dbData: error in insert transaction function: ', err)
        doesInsertTransaction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesInsertTransaction.promise
  }
}

module.exports = Subcription
