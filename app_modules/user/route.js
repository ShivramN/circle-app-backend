const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth/authentication')
const internaSession = require('../../middlewares/auth/internalSession')
const authstrategy = require('../../config').authentication
const apiHitsAllowedMiddleware = require('../../middlewares/apiHitsAllowed')

// Routes
// User routes
router.post('/forceUpdate', require('./controllers/forceUpdate.js'))
router.post('/login', internaSession, require('./controllers/login.js'))
router.post('/signUp', internaSession, require('./controllers/signUp.js'))
router.post('/resendOtp', internaSession, require('./controllers/resendOtp.js'))
router.patch('/updateProfile', internaSession, require('./controllers/setUsername.js'))
router.post('/verifyOtp', internaSession, require('./controllers/verification.js'))
router.get('/verifyEmail', internaSession, require('./controllers/emailVerify.js'))
router.get('/verifyUserName', internaSession, require('./controllers/usernameVerify.js'))
router.post('/forgetPassword', internaSession, require('./controllers/forgetPwd.js'))
router.post('/generateUserName', internaSession, require('./controllers/generateUsername.js'))

router.patch('/changePassword', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/changePassword.js'))
router.put('/updateProfilePic', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/updateProfilePic.js'))
router.get('/getInitialData', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/getInitialData.js'))
router.patch('/updateCategoryList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, require('./controllers/addUpdateCategory.js'))
router.get('/getCategoryBasedUserList', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), apiHitsAllowedMiddleware, require('./controllers/specialUser.js'))
router.get('/getCategories', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/getCategory.js'))
router.post('/searchUser', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/searchUser.js'))
router.post('/resetPassword', internaSession, require('./controllers/resetPassword'))
router.patch('/updateToken', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/updateToken.js'))
router.post('/socialLogin', internaSession, require('./controllers/socialLogin'))
router.delete('/deleteUser', authMiddleware.authenticate(authstrategy.strategy.jwt.name, authstrategy.strategy.jwt.options), require('./controllers/deleteUser'))
module.exports = router
