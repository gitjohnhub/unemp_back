module.exports = function getFirstAndLastDayOfMonth(dateString) {
  const [year, month] = dateString.split('-');
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  return [firstDay.toISOString().slice(0, 10), lastDay.toISOString().slice(0, 10)];
}
