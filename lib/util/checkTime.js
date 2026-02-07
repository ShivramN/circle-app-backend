const moment = require('moment')

const checkTime = (date) => {
  let userDate = moment(date)
  let diffDate = moment().diff(userDate, 'days')
  return diffDate;
}
module.exports = checkTime