const __logger = require('../../../lib/logger')
const __constants = require('../../../config/constants')
const __util = require('../../../lib/util')
const Validation = require('../services/validation')
const Service = require('../services/dbData')

const viewList = (req, res) => {
  __logger.info('inside viewList :: ')
  const userId = req.user && req.user.userId ? req.user.userId : '0'
  const validate = new Validation()
  const service = new Service()

  validate.viewValidation(req.body)
    .then((data) => {
      return service.viewList(req.body, userId)
    })
    .then(data => {
      __logger.info('viewList function :: Then 1')
      return __util.send(res, { type: __constants.RESPONSE_MESSAGES.SUCCESS, data: 'Inserted Successfully' })
    })
    .catch(err => {
      __logger.error('viewList function :: error: ', err)
      return __util.send(res, { type: err.type || __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: err.err })
    })
}

module.exports = viewList
