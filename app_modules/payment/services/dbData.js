
const q = require('q')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const __config = require('../../../config')
const __db = require('../../../lib/db')
const stripe = require('stripe')(__config.stripe_key)
const queryProvider = require('../queryProvider')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const UserService = require('../../user/services/dbData')
const checkDays = require('../../../lib/util/checkTime')

class Payment {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  insertTransaction (userId, planDetails, paymentId) {
    __logger.info('insertTransaction:', userId)
    const doesInsertTransaction = q.defer()
    const transactionId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertTransaction(), [transactionId, planDetails.planId, paymentId, planDetails.planDiscountPrice, planDetails.planTotalDays, planDetails.planName, __constants.STRIPE_STATUS[0], __constants.PAYMENT_TYPE[0], userId])
      .then(result => {
        __logger.info('dbData: insertTransaction(): then 1:', result)
        doesInsertTransaction.resolve(paymentId)
      })
      .catch(err => {
        __logger.error('insertTransaction :: dbData: error in insert transaction function: ', err)
        doesInsertTransaction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesInsertTransaction.promise
  }

  paymentIntents (customer, planDetails, ephemeralKeys) {
    const doesPaymentIntents = q.defer()
    stripe.paymentIntents.create({
      amount: parseInt(planDetails.planDiscountPrice) * 100,
      currency: 'inr',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true
      }
    }).then(async data => {
      await this.insertTransaction(customer.id, planDetails, data.id)
      doesPaymentIntents.resolve({
        paymentIntent: data.client_secret,
        ephemeralKey: ephemeralKeys,
        customer: customer.id,
        publishableKey: __config.stripe_public_key
      })
    }).catch((err) => {
      __logger.error('payment function :: paymentIntents :: error: ', err)
      doesPaymentIntents.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
    })
    return doesPaymentIntents.promise
  }

  ephemeralKeysFunction (customer, planDetails) {
    const doesEphemeralKeysFunction = q.defer()
    stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: __constants.STRIPE_API_VERSION }
    ).then((data) => {
      if (data) {
        doesEphemeralKeysFunction.resolve(this.paymentIntents(customer, planDetails, data.secret))
      }
    }).catch((err) => {
      __logger.error('payment function :: ephemeralKeysFunction :: error: ', err)
      doesEphemeralKeysFunction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
    })
    return doesEphemeralKeysFunction.promise
  }

  async stripeFunction (planDetails, userId, fullName, email) {
    __logger.info('dbData: stripeFunction(): ', userId)
    const doesStripeFunction = q.defer()
    let customer
    const checkUserExists = await stripe.customers.retrieve(userId).catch(() => { return null })
    if ((checkUserExists === null) || (checkUserExists.deleted)) {
      customer = await stripe.customers.create({
        id: userId,
        name: fullName,
        email: email
      }).catch((err) => {
        __logger.error('payment function :: customers :: error: ', err)
        doesStripeFunction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    } else {
      customer = checkUserExists
    }
    this.ephemeralKeysFunction(customer, planDetails)
      .then((data) => {
        if (data) {
          doesStripeFunction.resolve(data)
        }
      })
      .catch(err => {
        __logger.error('payment function :: stripeFunction :: error: ', err)
        doesStripeFunction.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesStripeFunction.promise
  }

  transactionDetails (paymentId, userId) {
    __logger.info('transactionDetails:', paymentId, userId)
    const doesTransactionDetails = q.defer()
    const userService = new UserService()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getTransaction(), [paymentId, userId])
      .then(async result => {
        __logger.info('dbData: transactionDetails(): then 1:', result)
        if (result && result.length > 0) {
          const totalDays = checkDays(result[0].createdOn)
          if (result[0].planValidDays > 0) result[0].planValidDays -= totalDays
          result[0].planValidDays += result[0].planDays
          await userService.updatePlan(userId, result[0].planId, result[0].planValidDays)
          return { userId, planValidDays: result[0].planValidDays, planId: result[0].planId }
        } else {
          doesTransactionDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .then(data => {
        if (data) {
          userService.subcriptionEmail(data.userId, data.planId, data.planValidDays)
          doesTransactionDetails.resolve(data)
        }
      })
      .catch(err => {
        __logger.error('transactionDetails :: dbData: error in get transaction function: ', err)
        doesTransactionDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesTransactionDetails.promise
  }

  updateSuccess (event) {
    __logger.info('updateSuccess:', event)
    const doesUpdateSuccess = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateSuccessTransaction(), [JSON.stringify(event), __constants.STRIPE_STATUS[1], event.data.object.payment_method_details.type, event.data.object.payment_method_details.card.brand, event.data.object.payment_method_details.card.last4, event.data.object.payment_method_details.card.exp_month, event.data.object.payment_method_details.card.exp_year, event.data.object.payment_method_details.card.funding, event.data.object.customer, event.data.object.payment_intent])
      .then(result => {
        __logger.info('dbData: updateSuccess(): then 1:', result)
        if (result && result.affectedRows === 1) {
          doesUpdateSuccess.resolve(this.transactionDetails(event.data.object.payment_intent, event.data.object.customer))
        } else {
          doesUpdateSuccess.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updateSuccess :: dbData: error in update transaction function: ', err)
        doesUpdateSuccess.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesUpdateSuccess.promise
  }

  updateFailed (event) {
    __logger.info('updateFailed:', event)
    const doesUpdateSuccess = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateFailedTransaction(), [JSON.stringify(event), __constants.STRIPE_STATUS[2], event.data.object.customer, event.data.object.payment_intent])
      .then(result => {
        __logger.info('dbData: updateFailed(): then 1:', result)
        if (result && result.affectedRows === 1) {
          doesUpdateSuccess.resolve(event.data.object.payment_intent)
        } else {
          doesUpdateSuccess.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updateFailed :: dbData: error in update transaction function: ', err)
        doesUpdateSuccess.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesUpdateSuccess.promise
  }

  applePay (planDetails, userId, paymentId) {
    __logger.info('applePay:', userId)
    const doesApplePay = q.defer()
    const transactionId = this.uniqueId.uuid()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.applePayTransaction(), [transactionId, planDetails.planId, paymentId, planDetails.planDiscountPrice, planDetails.planTotalDays, planDetails.planName, __constants.STRIPE_STATUS[1], __constants.PAYMENT_TYPE[1], userId])
      .then(result => {
        __logger.info('dbData: applePay(): then 1:', result)
        if (result && result.affectedRows === 1) {
          doesApplePay.resolve(this.transactionDetails(paymentId, userId))
        } else {
          doesApplePay.resolve(true)
        }
      })
      .catch(err => {
        __logger.error('applePay :: dbData: error in insert transaction function: ', err)
        doesApplePay.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err?.err })
      })
    return doesApplePay.promise
  }
}

module.exports = Payment
