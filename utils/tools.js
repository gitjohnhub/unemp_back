const moment = require('moment');
module.exports = function getFirstAndLastDayOfMonth(dateString) {
  // const [year, month] = dateString.split('-');
  const mydate = moment(dateString, 'YYYY-MM');
  const firstDay = mydate.startOf('month').format('YYYY-MM-DD');
  const f_lastDay = moment(mydate.endOf('month').format('YYYY-MM-DD')).add(12, 'hours');
  const lastDay = f_lastDay.format('YYYY-MM-DD HH:mm:ss')
  console.log('firstDay===>',firstDay)
  console.log('lastDay===>',lastDay)

  return [firstDay,lastDay];
}
