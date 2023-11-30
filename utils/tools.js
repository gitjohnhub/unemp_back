const moment = require('moment');
function getFirstAndLastDayOfMonth(dateString) {
  console.log('dateString===>',dateString)
  const mydate = moment(dateString, 'YYYY-MM');
  console.log('mydate===>',mydate)
  const firstDay = mydate.startOf('month').format('YYYY-MM-DD');
  const f_lastDay = moment(mydate.endOf('month').format('YYYY-MM-DD')).add(23, 'hours');
  const lastDay = f_lastDay.format('YYYY-MM-DD HH:mm:ss')
  console.log('firstDay===>',firstDay)
  console.log('lastDay===>',lastDay)

  return [firstDay,lastDay];
}
function getFirstAndLastDayOfMonthFromArray(dateArray) {
  console.log('dateArray===>',dateArray)
  const firstDay = moment(dateArray[0], 'YYYY-MM-DD').format('YYYY-MM-DD');
  const f_lastDay = moment(dateArray[1], 'YYYY-MM-DD').add(12, 'hours');
  const lastDay = f_lastDay.format('YYYY-MM-DD HH:mm:ss')
  console.log('firstDay===>',firstDay)
  console.log('lastDay===>',lastDay)

  return [firstDay,lastDay];
}
module.exports = {
  getFirstAndLastDayOfMonth,
  getFirstAndLastDayOfMonthFromArray
}