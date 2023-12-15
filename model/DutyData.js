const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const dutyData = sequelize.define('dutys', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dutyPerson: DataTypes.STRING,
  dutyDay: DataTypes.STRING,
  createtime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    timezone: '+08:00',
  },
});
// dutyData.sync({ alter: true })

module.exports = dutyData;
