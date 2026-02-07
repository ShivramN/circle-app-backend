const q = require('q')
const __db = require('../../../lib/db')
const queryProvider = require('../queryProvider')
const __constants = require('../../../config/constants')
const ValidatonService = require('./validation')
const Verification = require('./verification')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const passMgmt = require('../../../lib/util/password_mgmt')
const __logger = require('../../../lib/logger')
const uniqueGenerator = require('../../../lib/util/uniqueUsername')

class UserData {
  constructor () {
    this.validate = new ValidatonService()
    this.uniqueId = new UniqueId()
  }

  getUserDataByEmailOrUsername (emailAndUsername) {
    __logger.info('dbData: getUserDataByEmailOrUsername(): ', emailAndUsername)
    const getUserDataByEmailOrUsername = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDataByEmailOrUsername(), [emailAndUsername, emailAndUsername])
      .then(result => {
        __logger.info('dbData: getUserDataByEmailOrUsername(): then 1:', result)
        getUserDataByEmailOrUsername.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        getUserDataByEmailOrUsername.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return getUserDataByEmailOrUsername.promise
  }

  getUserDataByEmail (email, forgetKey = null) {
    __logger.info('dbData: getUserDataByEmail(): ', email)
    const getUserDataByEmail = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDataByEmail(forgetKey), [email])
      .then(result => {
        __logger.info('dbData: getUserDataByEmail(): then 1:', result)
        getUserDataByEmail.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        getUserDataByEmail.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return getUserDataByEmail.promise
  }

  getUserDataByUserId (userId, flag = false) {
    __logger.info('dbData: getUserDataByUserId(): ', userId)
    const getUserDataByUserId = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDetailsByUserId(flag), [userId])
      .then(result => {
        if (result && result.length > 0) {
          __logger.info('dbData: getUserDataByUserId(): then 1:', result)
          getUserDataByUserId.resolve(result)
        } else {
          getUserDataByUserId.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.msg })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in get user function: ', err)
        getUserDataByUserId.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return getUserDataByUserId.promise
  }

  createUser (email, signupType) {
    __logger.info('dbData: createUser():', email)
    const userCreated = q.defer()
    let userId
    this.getUserDataByEmail(email)
      .then(async exists => {
        __logger.info('dbData: createUser(): exists: then 2:', exists)
        if (exists && exists.length === 0) {
          userId = this.uniqueId.uuid()
          return __db.mysql.query(__constants.MYSQL_NAME, queryProvider.createUser(), [email, userId, userId, signupType, null, 1])
        } else if (!exists[0]?.isProfileCompleted || !exists[0]?.is_active) {
          if (!exists[0]?.is_active) {
            await __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateUser(), [true, exists[0].userId, exists[0].userId, true, exists[0].userId, exists[0].userId, true, exists[0].userId, exists[0].userId, true, exists[0].userId, exists[0].userId, true, exists[0].userId, exists[0].userId])
          }
          return exists
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.EMAIL_EXISTS, data: { isUserExist: true }, err: __constants.RESPONSE_MESSAGES.EMAIL_EXISTS.message })
        }
      })
      .then(result => {
        __logger.info('dbData: createUser(): exists: then 3:', result)
        if (result && result.affectedRows && result.affectedRows > 0) {
          userCreated.resolve({ userId })
        } else if (!result?.[0]?.isVerified || result?.[0]?.isVerified) {
          userCreated.resolve({ userId: result[0].userId, isVerified: 0 })
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: createUser(): catch:', err)
        userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userCreated.promise
  }

  socialLogin (email, signupType, socialToken) {
    __logger.info('dbData: socialLogin():', email)
    const userCreated = q.defer()
    let userId
    this.getUserDataByEmail(email)
      .then(async exists => {
        __logger.info('dbData: socialLogin(): exists: then 1:', exists)
        if (exists && exists.length === 0) {
          userId = this.uniqueId.uuid()
          const result = await __db.mysql.query(__constants.MYSQL_NAME, queryProvider.createUser(), [email, userId, userId, signupType, socialToken, 1])
          return result
        } else {
          if (exists[0].signupType !== signupType) {
            userCreated.reject({ type: __constants.RESPONSE_MESSAGES.EMAIL_EXISTS, err: __constants.RESPONSE_MESSAGES.EMAIL_EXISTS.message })
          } else {
            userId = exists[0].userId
            await __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateSocialToken(), [socialToken, userId, true, userId, true, userId, userId, true, userId, userId, true, userId, userId, true, userId, userId])
            return !exists[0]?.isProfileCompleted ? exists[0].userId : userCreated.resolve({ userId: exists[0].userId, user: exists[0].user, isExist: true })
          }
        }
      })
      .then(result => {
        __logger.info('dbData: socialLogin(): exists: then 2:', result)
        if ((result && (result.affectedRows) && (result.affectedRows > 0)) || (result && (result.length > 0))) {
          userCreated.resolve({ userId: userId || result, isExist: false })
        } else {
          userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: socialLogin(): catch:', err)
        userCreated.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userCreated.promise
  }

  checkUserDetails (username) {
    __logger.info('dbData: getUserDetails(): ')
    const checkUserDetails = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [username])
      .then(result => {
        __logger.info('dbData: getUserDetails(): then 1:', result)
        if (result && result.length > 0) {
          checkUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.USERNAME_EXIST, err: __constants.RESPONSE_MESSAGES.USERNAME_EXIST.message })
        } else {
          checkUserDetails.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('getUserDetails :: dbData: error in get user function: ', err)
        checkUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return checkUserDetails.promise
  }

  setUserdetails (userId, username, fullName, planId, gender, dob) {
    __logger.info('dbData: setUserdetails(): ')
    const userDetailId = this.uniqueId.uuid()
    const userDetail = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.setUserdetails(), [userDetailId, username, fullName, planId, gender, dob, userId, this.uniqueId.uuid(), userId])
      .then(result => {
        __logger.info('dbData: setUserdetails(): then 1:', result)
        userDetail.resolve(result)
      })
      .catch(err => {
        __logger.error('setUserdetails :: dbData: error in insert user details function: ', err)
        userDetail.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userDetail.promise
  }

  setPassword (userId, password = null) {
    __logger.info('dbData: setPassword(): ')
    const passwordSalt = passMgmt.genRandomString(16)
    const hashPassword = password ? passMgmt.create_hash_of_password(password, passwordSalt).passwordHash : null
    const userPwd = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.setUserPwd(hashPassword, passwordSalt), [userId, userId])
      .then(result => {
        __logger.info('dbData: setPassword(): then 1:', result)
        if (result && result.affectedRows === 1) {
          userPwd.resolve(result)
        } else {
          userPwd.reject({ type: __constants.RESPONSE_MESSAGES.USER_ID_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_ID_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('setPassword :: dbData: error in insert password function: ', err)
        userPwd.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return userPwd.promise
  }

  checkEmailExist (email) {
    __logger.info('addVerificationCode:')
    const emailExistsOrNot = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDetailsByEmail(), [email])
      .then(result => {
        __logger.info('dbData: setPassword(): then 1:', result)
        if (result && result.length > 0) {
          emailExistsOrNot.resolve(result[0].userId)
        } else {
          emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('setPassword :: dbData: error in update user function: ', err)
        emailExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return emailExistsOrNot.promise
  }

  checkUsernameExist (username) {
    __logger.info('checkUsernameExist:')
    const usernameExistsOrNot = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [username])
      .then(result => {
        __logger.info('dbData: checkUsernameExist(): then 1:', result)
        if (result && result.length > 0) {
          usernameExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.USERNAME_EXIST, err: __constants.RESPONSE_MESSAGES.USERNAME_EXIST.message })
        } else {
          usernameExistsOrNot.resolve(result)
        }
      })
      .catch(err => {
        __logger.error('checkUsernameExist :: dbData: error in check Username Exist function: ', err)
        usernameExistsOrNot.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return usernameExistsOrNot.promise
  }

  setPhotoUrl (userId, url) {
    __logger.info('setPhotoUrl:', userId)
    const photoUrl = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updatePhotoUrl(), [url, userId, userId])
      .then(result => {
        __logger.info('dbData: setPhotoUrl(): then 1:', result)
        if (result && result.affectedRows === 1) {
          photoUrl.resolve(result)
        } else {
          photoUrl.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('setPhotoUrl :: dbData: error in Update photo function: ', err)
        photoUrl.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return photoUrl.promise
  }

  updateotpVerifed (userId, isProfileCompleted = false) {
    __logger.info('updateotpVerifed:')
    const otpVerified = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateotpVerifed(), [isProfileCompleted, userId, userId, userId])
      .then(result => {
        __logger.info('dbData: updateotpVerifed(): then 1:', result)
        if (result && result[0] && result[0].affectedRows >= 1) {
          this.deleteOtp(userId)
          otpVerified.resolve({ userId, needUserInfo: Boolean(!isProfileCompleted) })
        } else {
          otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updateotpVerifed :: dbData: error in Update otp verified function: ', err)
        otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return otpVerified.promise
  }

  updatePwd (userId, newPwd, saltKey) {
    __logger.info('updatePwd:')
    const otpVerified = q.defer()
    const hashPassword = passMgmt.create_hash_of_password(newPwd, saltKey).passwordHash
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updatePwd(), [hashPassword, userId, userId])
      .then(result => {
        __logger.info('dbData: updatePwd(): then 1:', result)
        if (result && result.affectedRows === 1) {
          otpVerified.resolve(result)
        } else {
          otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('updatePwd :: dbData: error in Update photo function: ', err)
        otpVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return otpVerified.promise
  }

  generateUsername (username, email, count) {
    __logger.info('generateUsername:', username, email, count)
    const doesGenerateUsername = q.defer()
    let setEmail = username
    if (count > 2) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      setEmail = result
    }
    const result = uniqueGenerator(setEmail)
    this.checkUsername(result, email, count)
      .then(result => {
        doesGenerateUsername.resolve(result)
      })
      .catch(err => {
        __logger.error('generateUsername :: dbData: error in generate Username function: ', err)
        doesGenerateUsername.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGenerateUsername.promise
  }

  checkUsername (username, email, count = 0) {
    __logger.info('checkUsername:')
    const doesCheckUsername = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserDetailsByUsername(), [username])
      .then(result => {
        __logger.info('dbData: checkUsername(): then 1:', result)
        if (result && result.length > 0) {
          count += 1
          this.generateUsername(username, email, count)
        } else {
          doesCheckUsername.resolve(username)
        }
      })
      .catch(err => {
        __logger.error('checkUsername :: dbData: error in check Username Exist function: ', err)
        doesCheckUsername.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUsername.promise
  }

  getUserDetails (userId) {
    __logger.info('getUserDetails:')
    const doesGetUserDetails = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.userDetails(), [userId])
      .then(result => {
        __logger.info('dbData: getUserDetails(): then 1:', result)
        if (result && result.length > 0) {
          doesGetUserDetails.resolve(result[0])
        } else {
          doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, data: {} })
        }
      })
      .catch(err => {
        __logger.error('getUserDetails :: dbData: error in get user details function: ', err)
        doesGetUserDetails.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetUserDetails.promise
  }

  updatePlan (userId, planId, totalOfPlan = 0) {
    __logger.info('updatePlan:', userId)
    const doesUpdatePlan = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updatePlan(), [planId, userId, totalOfPlan, userId])
      .then(result => {
        if (result && result.affectedRows === 1) {
          doesUpdatePlan.resolve(planId)
        } else {
          doesUpdatePlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('updatePlan :: dbData: error in update Plan in User detials function: ', err)
        doesUpdatePlan.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdatePlan.promise
  }

  getAllUserDetalis (userId) {
    __logger.info('getAllUserDetalis:')
    const doesGetAllUserDetalis = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.userDetailsWithCategory(), [userId])
      .then(result => {
        __logger.info('dbData: getAllUserDetalis(): then 1:', result)
        if (result && result[0].length > 0) {
          result[0][0].category = result[0][0].categoryId.reduce((acc, categoryId) => {
            const category = result[1].find(category => category.categoryId === categoryId)
            if (category !== undefined) acc.push(category)
            return acc
          }, [])
          delete result[0][0].categoryId
          doesGetAllUserDetalis.resolve(result[0][0])
        } else {
          doesGetAllUserDetalis.reject({ type: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST, err: __constants.RESPONSE_MESSAGES.USER_NOT_EXIST.message })
        }
      })
      .catch(err => {
        __logger.error('getAllUserDetalis :: dbData: error in get user details function: ', err)
        doesGetAllUserDetalis.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetAllUserDetalis.promise
  }

  addVerificationCode (userId, expireTime, codeLength) {
    __logger.info('addVerificationCode:')
    const doesAddVerificationCode = q.defer()
    const code = this.uniqueId.randomInt(codeLength)
    const time = new Date(Date.now() + expireTime)
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.addOtpCode(), [this.uniqueId.uuid(), code, time, userId])
      .then(result => {
        __logger.info('dbData: addVerificationCode(): then 1:', result)
        if (result && result.affectedRows === 1) {
          doesAddVerificationCode.resolve({ code })
        } else {
          doesAddVerificationCode.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('addVerificationCode :: dbData: error in add verification code function: ', err)
        doesAddVerificationCode.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesAddVerificationCode.promise
  }

  getOtpCode (userId, code) {
    __logger.info('getOtpCode:', userId, code)
    const doesGetOtpCode = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getOtpCode(), [userId, userId, code])
      .then(result => {
        __logger.info('dbData: getOtpCode(): then 1:', result)
        if (result && result.length > 0) {
          doesGetOtpCode.resolve(result[0])
        } else {
          doesGetOtpCode.reject({ type: __constants.RESPONSE_MESSAGES.INVALID_OTP, data: { isValidOTP: false }, err: 'Please enter a valid OTP' })
        }
      })
      .catch(err => {
        __logger.error('getOtpCode :: dbData: error in add verification code function: ', err)
        doesGetOtpCode.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesGetOtpCode.promise
  }

  insertUpdateCategory (userId, categoryId) {
    __logger.info('dbData: insertUpdateCategory(): ', userId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.insertUpdateCategory(), [categoryId, userId, userId])
      .then(result => {
        __logger.info('dbData: insertUpdateCategory(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  insert Update Category function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }

  getUserdetails (userId, categoryId) {
    __logger.info('dbData: getUserdetails(): ', userId, categoryId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserdetails(categoryId), [userId, userId, 0])
      .then(result => {
        __logger.info('dbData: getUserdetails(): then 1:', result)
        if (result && result.length > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  get User details function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }

  checkUserVerified (userId) {
    __logger.info('dbData: checkUserVerified(): ', userId)
    const doesCheckUserVerified = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.getUserVerified(), [userId])
      .then(result => {
        __logger.info('dbData: checkUserVerified(): then 1:', result)
        const response = result?.[0]?.userDetailId ? __constants.RESPONSE_MESSAGES.USER_EXIST : __constants.RESPONSE_MESSAGES.USER_NOT_VERIFIED
        if (result && result.length > 0 && result[0].userDetailId === null) {
          doesCheckUserVerified.resolve(result[0])
        } else {
          doesCheckUserVerified.reject({ type: response, err: response.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  check User verified function: ', err)
        doesCheckUserVerified.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesCheckUserVerified.promise
  }

  deleteOtp (userId) {
    __logger.info('deleteOtp:', userId)
    const doesDeleteOtp = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.deleteOtp(), [userId])
      .then(result => {
        __logger.info('dbData: deleteOtp(): then 1:', result)
        doesDeleteOtp.resolve(userId)
      })
      .catch(err => {
        __logger.error('deleteOtp :: dbData: error in delete otp code record function: ', err)
        doesDeleteOtp.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDeleteOtp.promise
  }

  updateCount (updateValue, userId) {
    __logger.info('dbData: updateCount(): ', userId)
    const doesUpdateCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateCount(updateValue), [userId])
      .then(result => {
        __logger.info('dbData: updateCount(): then 1:', result)
        doesUpdateCount.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in update count function: ', err)
        doesUpdateCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateCount.promise
  }

  detectCoin (coin, userId) {
    __logger.info('dbData: DetectCoin(): ', userId)
    const doesDetectCoin = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.detectCoin(), [coin, userId])
      .then(result => {
        __logger.info('dbData: DetectCoin(): then 1:', result)
        doesDetectCoin.resolve(result)
      })
      .catch(err => {
        __logger.error('dbData: error in update count function: ', err)
        doesDetectCoin.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesDetectCoin.promise
  }

  filterUsername (user, userId) {
    __logger.info('dbData: filterUsername(): ')
    const doesFilterUsername = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.filterUsername(), [`%${user}%`, `%${user}%`, userId])
      .then(result => {
        __logger.info('dbData: filterUsername(): then 1:', result)
        if (result && result.length > 0) {
          doesFilterUsername.resolve(result)
        } else {
          doesFilterUsername.reject({ type: __constants.RESPONSE_MESSAGES.USERNAME_NOT_FOUND, err: __constants.RESPONSE_MESSAGES.USERNAME_NOT_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in filter username function: ', err)
        doesFilterUsername.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesFilterUsername.promise
  }

  updateUserProfile (userDetails, userId) {
    __logger.info('dbData: updateUserProfile(): ')
    const doesUpdateUserProfile = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateUserProfile(), [userDetails.fullName, userDetails.dateOfBirth, userDetails.gender, userDetails.shortBio, userDetails.occupation, userId, userId])
      .then(result => {
        __logger.info('dbData: updateUserProfile(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateUserProfile.resolve(result)
        } else {
          doesUpdateUserProfile.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in upadte user profile function: ', err)
        doesUpdateUserProfile.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateUserProfile.promise
  }

  updateUserInfo (userDetails, userId) {
    __logger.info('dbData: updateUserInfo(): ')
    const doesUpdateUserInfo = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateUserInfo(), [userDetails.phoneCode, userDetails.phoneNumber, userDetails.address, userId, userId])
      .then(result => {
        __logger.info('dbData: updateUserInfo(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesUpdateUserInfo.resolve(result)
        } else {
          doesUpdateUserInfo.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in upadte user profile function: ', err)
        doesUpdateUserInfo.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateUserInfo.promise
  }

  requestCelebrity (userId) {
    __logger.info('dbData: requestCelebrity(): ')
    const doesRequestCelebrity = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.requestCelebrity(), [__constants.VERIFIED_STATUS[0], userId, userId])
      .then(result => {
        __logger.info('dbData: requestCelebrity(): then 1:', result)
        if (result && result.affectedRows > 0) {
          doesRequestCelebrity.resolve(result)
        } else {
          doesRequestCelebrity.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in upadte user profile function: ', err)
        doesRequestCelebrity.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRequestCelebrity.promise
  }

  updateToken (userId, fcmToken) {
    __logger.info('dbData: updateToken(): ', userId, fcmToken)
    const doesUpdateToken = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateToken(), [fcmToken, userId, userId])
      .then(result => {
        __logger.info('dbData: updateToken(): then 1:', result)
        if (result && result.length > 0) {
          doesUpdateToken.resolve(result)
        } else {
          doesUpdateToken.reject({ type: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND, err: __constants.RESPONSE_MESSAGES.NO_RECORDS_FOUND.message })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  get User token function: ', err)
        doesUpdateToken.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesUpdateToken.promise
  }

  subcriptionEmail (userId, planId, totalOfPlan) {
    __logger.info('subcriptionEmail:', userId)
    const doesSubcriptionEmail = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.subcriptionEmail(), [planId, userId])
      .then(result => {
        if (result && result.length > 0) {
          const verification = new Verification()
          doesSubcriptionEmail.resolve(verification.sendSubcriptionByEmail(result[0].planDiscountPrice, result[0].fullName, result[0].planName, result[0].planTitle, totalOfPlan, result[0].emailId))
        } else {
          doesSubcriptionEmail.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('subcriptionEmail :: dbData: error in update Plan in User detials function: ', err)
        doesSubcriptionEmail.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesSubcriptionEmail.promise
  }

  deleteUser (userId) {
    __logger.info('dbData: deleteUser(): ', userId)
    const doesRemoveCount = q.defer()
    __db.mysql.query(__constants.MYSQL_NAME, queryProvider.updateUser(), [false, userId, userId, false, userId, userId, false, userId, userId, false, userId, userId, false, userId, userId])
      .then(result => {
        __logger.info('dbData: deleteUser(): then 1:', result)
        if (result && result[0] && result[0].affectedRows > 0) {
          doesRemoveCount.resolve(result)
        } else {
          doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, data: {} })
        }
      })
      .catch(err => {
        __logger.error('dbData: error in  insert Update Category function: ', err)
        doesRemoveCount.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err })
      })
    return doesRemoveCount.promise
  }
}
module.exports = UserData
