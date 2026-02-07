const ValidationService = require('../services/validation')
const __util = require('../../../lib/util')
const passMgmt = require('../../../lib/util/password_mgmt')
const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const __db = require('../../../lib/db')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')

const controller = (req, res) => {
  __logger.info('Inside admin signup')
  const validate = new ValidationService()
  const uniqueId = new UniqueId()

  validate.signup(req.body)
    .then(data => {
      __logger.info('Signup :: controller :: Then 1 - validation passed')
      return __db.mysql.query(__constants.MYSQL_NAME, 
        'SELECT user_id FROM master WHERE email = ? AND is_active = 1', 
        [req.body.email])
    })
    .then(existingUser => {
      if (existingUser && existingUser.length > 0) {
        return Promise.reject({ 
          type: __constants.RESPONSE_MESSAGES.EMAIL_ALREADY_EXIST, 
          err: 'Email already registered' 
        })
      }
      
      const salt = passMgmt.genRandomString(16)
      const hashResult = passMgmt.create_hash_of_password(req.body.password, salt)
      const userId = uniqueId.uuid()

      return __db.mysql.query(__constants.MYSQL_NAME,
        `INSERT INTO master (user_id, email, full_name, salt_key, hash_password, is_active, created_on, created_by) 
         VALUES (?, ?, ?, ?, ?, 1, NOW(), ?)`,
        [userId, req.body.email, req.body.fullName, salt, hashResult.passwordHash, userId])
    })
    .then(result => {
      if (result && result.affectedRows > 0) {
        return __util.send(res, { 
          type: __constants.RESPONSE_MESSAGES.SUCCESS, 
          data: { message: 'Admin registered successfully' } 
        })
      }
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: 'Failed to create admin' })
    })
    .catch(err => {
      __logger.error('error: signup function', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err || err })
    })
}

module.exports = controller
