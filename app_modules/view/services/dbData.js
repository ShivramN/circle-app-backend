const __constants = require('../../../config/constants')
const __logger = require('../../../lib/logger')
const NewService = require('../../news/services/dbData')
const VoiceService = require('../../voices/services/dbData')
const EventService = require('../../events/services/dbData')

class View {
  viewList (details, userId) {
    __logger.info('dbData: voices :: voiceViewList(): ', userId)
    const values = Object.keys(details)
    const service = {
      [__constants.MEDIA_TYPE[0]]: new NewService(),
      [__constants.MEDIA_TYPE[1]]: new VoiceService(),
      [__constants.MEDIA_TYPE[2]]: new EventService()
    }
    values.forEach((element) => {
      service[element].viewList(details[element], userId)
    })
  }
}

module.exports = View
