const dateUtil = require('date-format-utils')
const __config = require('../config')
const __logger = require('../lib/logger')
const user = require('../app_modules/user/route')
const admin = require('../app_modules/admin/route')
const mapped = require('../app_modules/userMapped/route')
const subscription = require('../app_modules/subscription/route')
const news = require('../app_modules/news/route')
const voices = require('../app_modules/voices/route')
const events = require('../app_modules/events/route')
const general = require('../app_modules/general/route')
const profile = require('../app_modules/profile/route')
const view = require('../app_modules/view/route')
const payment = require('../app_modules/payment/route')
const notification = require('../app_modules/notification/route')

module.exports = function (app) {
  // region all api
  app.all('*', function (request, response, next) {
    const uuid = request.id
    request.req_ip = (request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(',').shift().trim() : request.ip)
    const startTime = new Date()
    request.req_t = startTime
    __logger.info('routes.index: ' + uuid + '=> API REQUEST:: ', { req_ip: request.req_ip, uri: request.originalUrl, req_t: dateUtil.formatDate(startTime, 'yyyy-MM-dd HH:mm:ss.SSS') })
    response.on('finish', function () {
      const endTime = new Date()
      const responseTime = endTime - startTime
      __logger.info('routes.index: ' + uuid + '=> API RESPONSE:: ', { req_ip: request.req_ip, uri: request.originalUrl, req_t: dateUtil.formatDate(startTime, 'yyyy-MM-dd HH:mm:ss.SSS'), res_t: dateUtil.formatDate(endTime, 'yyyy-MM-dd HH:mm:ss.SSS'), res_in: (responseTime / 1000) + 'sec' })
    })
    next()
  })
  // endregion

  // region api routes
  const apiUrlPrefix = '/' + __config.api_prefix + '/api'
  app.use(apiUrlPrefix + '/user', user)
  app.use(apiUrlPrefix + '/admin', admin)
  app.use(apiUrlPrefix + '/general', general)
  app.use(apiUrlPrefix + '/mapped', mapped)
  app.use(apiUrlPrefix + '/subscription', subscription)
  app.use(apiUrlPrefix + '/news', news)
  app.use(apiUrlPrefix + '/voices', voices)
  app.use(apiUrlPrefix + '/events', events)
  app.use(apiUrlPrefix + '/profile', profile)
  app.use(apiUrlPrefix + '/view', view)
  app.use(apiUrlPrefix + '/payment', payment)
  app.use(apiUrlPrefix + '/notification', notification)
  require('../lib/swagger')(app, '/' + __config.api_prefix + '/api')
  // endregion-------
}
