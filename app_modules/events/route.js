const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication
const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')
const planExpiryMiddleware = require('../../middlewares/checkFreePlan')

// Routes
// Events routes
router.put('/addEventThumbnail', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addEventThumbnail.js'))
router.put('/addEventMultiMedia', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addEventMultiMedia.js'))
router.get('/getLanguage', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getLanguage.js'))
router.post('/addEvent', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addEvent.js'))
router.put('/updateEvent', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/updateEvent.js'))
router.get('/getUserBasedEvents', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getUserBasedEvent.js'))
router.get('/getEvents', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getEvent.js'))
router.get('/getEventDetail', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getEventDetail.js'))
router.get('/getEventHalfDetail', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getEventHalfDetail.js'))
router.delete('/deleteEvent', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/deleteEventDetail.js'))
router.get('/getSuggestedEvent', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getSuggestedEvent.js'))
router.get('/inviteUserList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/inviteUserList.js'))
router.post('/saved', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/savedEvent.js'))
router.post('/shared', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/shareEvent.js'))
router.get('/createdEventList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getCreatedEventList.js'))
router.get('/boughtEventList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getBoughtEventList.js'))
router.get('/savedEventList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/savedEventList.js'))
router.get('/receivedEventList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/receivedEventList.js'))
router.post('/buyEvent', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/buyEvent.js'))
router.get('/listEventBuy', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/listEventBuy.js'))

module.exports = router
