const q = require('q')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const Mailjet = require('node-mailjet')
const __constants = require('../../config/constants')

class Emailer {
  constructor (configObj) {
    this.sendEmailFlag = configObj.sendEmail
    this.fromEmail = configObj.fromEmail
    this.provider = configObj.provider || 'smtp'
    
    if (this.provider === 'mailjet') {
      // Initialize Mailjet client
      this.mailjetClient = Mailjet.apiConnect(
        configObj.mailjet.apiKey,
        configObj.mailjet.apiSecret
      )
    } else {
      // Initialize SMTP transporter (fallback)
      this.transporter = nodemailer.createTransport(smtpTransport({
        service: configObj.service,
        host: configObj.host,
        port: configObj.port,
        auth: {
          user: configObj.auth.user,
          pass: configObj.auth.password
        },
        tls: configObj.tls,
        debug: configObj.debug
      }))
    }
  }

  sendEmail (toEmail, subject, html) {
    const emailSent = q.defer()
    if (!this.sendEmailFlag) {
      emailSent.resolve({ emailSent: true })
      return emailSent.promise
    }

    if (this.provider === 'mailjet') {
      // Send via Mailjet
      const request = this.mailjetClient
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: this.fromEmail,
                Name: 'The Circle App'
              },
              To: Array.isArray(toEmail) ? toEmail.map(email => ({ Email: email })) : [{ Email: toEmail }],
              Subject: subject,
              HTMLPart: html
            }
          ]
        })

      request
        .then(result => {
          emailSent.resolve({ emailSent: true, messageId: result.body.Messages[0].To[0].MessageID })
        })
        .catch(error => {
          emailSent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: error })
        })
    } else {
      // Send via SMTP (fallback)
      const options = {
        from: this.fromEmail,
        to: toEmail,
        subject: subject,
        html: html
      }
      this.transporter.sendMail(options, (error, info) => {
        if (error) {
          emailSent.reject({ type: __constants.RESPONSE_MESSAGES.SERVER_ERROR, err: error })
          return emailSent.promise
        }
        emailSent.resolve({ emailSent: true })
      })
    }

    return emailSent.promise
  }
}
module.exports = Emailer
