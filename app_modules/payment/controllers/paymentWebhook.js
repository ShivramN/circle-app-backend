const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __config = require('../../../config')
const __util = require('../../../lib/util')
const Service = require('../services/dbData')
const stripe = require('stripe')(__config.stripe_key)

const paymentWebhook = async (req, res) => {
  __logger.info('inside paymentWebhook :: ')
  const service = new Service()
  let event
  const signature = req.headers['stripe-signature']
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      __config.end_point_secret
    )
  } catch (err) {
    __logger.error('paymentWebhook Function :: Error :: Webhook signature verification failed.', err.message)
    return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'failed' })
  }

  // // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      __logger.error(`PaymentIntent for ${event.data.object.amount} was successful!`)
      break
    case 'charge.succeeded':
      __logger.error(`paymentMethod for ${event.data.object} was successful!`)
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      await service.updateSuccess(event)
      break
    case 'charge.failed':
      __logger.error(`paymentMethod for ${event.data.object} was successful!`)
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      await service.updateFailed(event)
      break
    case 'payment_intent.payment_failed':
      __logger.error(`paymentMethod for ${event.data.object} was successful!`)
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      await service.updateFailed(event)
      break
    default:
      // Unexpected event type
      __logger.error(`Unhandled event type ${event.type}.`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'success' })
}

module.exports = paymentWebhook
