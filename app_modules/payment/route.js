const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication
const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')

// Routes
// View routes
router.post('/initiatePayment', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, require('./controllers/payment.js'))
router.post('/webhook', require('./controllers/paymentWebhook'))
router.post('/applePayment', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/applePayment'))

module.exports = router
