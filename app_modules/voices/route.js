const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const authstrategy = require('../../config').authentication
const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')
const planExpiryMiddleware = require('../../middlewares/checkFreePlan')

// Routes
// Voices routes
router.put('/addVoiceMultiMedia', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addVoiceMultiMedia.js'))
router.post('/addVoice', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/addVoice.js'))
router.put('/updateVoice', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/updateVoice.js'))
router.get('/getUserBasedVoice', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getUserBasedVoice.js'))
router.get('/getVoice', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getVoice.js'))
router.get('/getVoiceDetail', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getVoiceDetail.js'))
router.delete('/deleteVoice', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/deleteVoiceDetail.js'))
router.get('/getSuggestedVoice', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getSuggestedVoice.js'))
router.post('/saved', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/savedVoice.js'))
router.post('/shared', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/shareVoice.js'))
router.get('/createdVoiceList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/getCreatedVoiceList.js'))
router.get('/savedVoiceList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/savedVoiceList.js'))
router.get('/receivedVoiceList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/receivedVoiceList.js'))
router.get('/tagVoiceList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, planExpiryMiddleware, require('./controllers/tagVoiceList.js'))

module.exports = router
