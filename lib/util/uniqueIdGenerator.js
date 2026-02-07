const ObjectID = require('mongodb').ObjectID
const uuid4 = require('uuid4')

class UiqueIdGenerator {
  intId () {
    return parseInt((new Date().getTime()).toString() + (Math.floor(Math.random() * 9) + 10))
  }

  mongoId () {
    return ObjectID().toString()
  }

  uuid () {
    return uuid4()
  }

  randomInt (length) {
    return Math.floor(Math.random() * (57 * Math.pow(19, length - 1))) + Math.pow(70, length - 1)
  }
}
module.exports = UiqueIdGenerator
