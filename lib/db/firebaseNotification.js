const admin = require("firebase-admin");
const __config = require('../../config');
const __logger = require('../logger');

class firebaseNotification {

    constructor () {
        __logger.debug("notification.constructor called.");
        this.connection = null;
    }

    init () {
        return new Promise((resolve, reject) => {
            let vm = this;
            if (!__config.notification.init) {
                vm.connection = null;
                __logger.debug("notification.init notification not initialized.");
                resolve("notification not initialized");
            }
            vm.connection = admin.initializeApp({
                credential: admin.credential.cert(__config.notification.options)
            });
            resolve("notification connected");
        });
    }

    sendNotification (messageBody, title, token, notificationType, sendUserId, notifictaionId) {
        return new Promise((resolve, reject) => {
            var message = {
                notification: {
                    title,
                    body: messageBody
                },
                apns: {
                    payload: {
                        aps: {
                            badge: 1,
                        },
                        details: {
                            notificationType,
                            sendUserId,
                            notifictaionId
                        }
                    }
                },
                token
            };
            // Send a message to devices subscribed to the provided topic.
            this.connection.messaging().send(message)
                .then((response) => {
                    // Response is a message ID string.
                    __logger.info('Successfully sent message:', response);
                    resolve(true)
                })
                .catch((error) => {
                    __logger.error('Error sending message:', error);
                    reject(false)
                });
        });
    }
}

module.exports = new firebaseNotification();