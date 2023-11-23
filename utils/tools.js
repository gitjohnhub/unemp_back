const moment = require('moment');
module.exports = function getFirstAndLastDayOfMonth(dateString) {
  console.log('dateString===>',dateString)
  const mydate = moment(dateString, 'YYYY-MM');
  console.log('mydate===>',mydate)
  const firstDay = mydate.startOf('month').format('YYYY-MM-DD');
  const f_lastDay = moment(mydate.endOf('month').format('YYYY-MM-DD')).add(12, 'hours');
  const lastDay = f_lastDay.format('YYYY-MM-DD HH:mm:ss')
  console.log('firstDay===>',firstDay)
  console.log('lastDay===>',lastDay)

  return [firstDay,lastDay];
}