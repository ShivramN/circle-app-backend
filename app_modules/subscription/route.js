const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')
const authstrategy = require('../../config').authentication

// Routes
// subscription routes
router.get('/getSubscriptionList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/getPlanDetails.js'))
router.post('/getStarted', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, require('./controllers/getStart.js'))

module.exports = router
