const q = require('q')
var __config = require('../../../config')
const UniqueId = require('../../../lib/util/uniqueIdGenerator')
const EmailService = require('../../../lib/sendNotifications/email')
const emailTemplates = require('../../../lib/sendNotifications/emailTemplates')
const __logger = require('../../../lib/logger')
const moment = require('moment')

class VerificationService {
  constructor () {
    this.uniqueId = new UniqueId()
  }

  sendVerificationCodeByEmail (code, email) {
    __logger.info('sendVerificationCodeByEmail:')
    const emailSent = q.defer()
    const emailService = new EmailService(__config.emailProvider)
    emailService.sendEmail([email], __config.emailProvider.subject.emailVerification, emailTemplates.verificationCodeTemplate(code))
      .then(data => emailSent.resolve(data))
      .catch(err => emailSent.reject(err))
    return emailSent.promise
  }

  sendForgetCodeByEmail (code, email, fullName) {
    __logger.info('sendForgetCodeByEmail:')
    const emailSent = q.defer()
    const emailService = new EmailService(__config.emailProvider)
    emailService.sendEmail([email], __config.emailProvider.subject.passwordReset, emailTemplates.forgetCodeTemplate(code, fullName))
      .then(data => emailSent.resolve(data))
      .catch(err => emailSent.reject(err))
    return emailSent.promise
  }

  sendSubcriptionByEmail (price, fullName, planName, planTitle, days, email) {
    __logger.info('sendSubcriptionByEmail:')
    const emailSent = q.defer()
    const emailService = new EmailService(__config.emailProvider)
    emailService.sendEmail([email], __config.emailProvider.subject.subscriptionTemplate, emailTemplates.subcriptionTemplate(fullName, planName, planTitle, moment().format('DD/MM/YYYY'), moment().add(days, 'days').format('DD/MM/YYYY'), price))
      .then(data => emailSent.resolve(data))
      .catch(err => emailSent.reject(err))
    return emailSent.promise
  }

  sendCelebrityByEmail (fullName, email) {
    __logger.info('sendCelebrityByEmail:')
    const emailSent = q.defer()
    const emailService = new EmailService(__config.emailProvider)
    emailService.sendEmail([email], __config.emailProvider.subject.celebrity, emailTemplates.celebrityTemplate(fullName))
      .then(data => emailSent.resolve(data))
      .catch(err => emailSent.reject(err))
    return emailSent.promise
  }
}

module.exports = VerificationService
