const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const BlackData = sequelize.define('black', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personName: DataTypes.STRING,
  personID: DataTypes.STRING,
  createtime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    timezone: '+08:00',
  },
  workRangeDate: DataTypes.TEXT,
  fromArea: DataTypes.STRING,
  note: DataTypes.STRING,
});
BlackData.sync({ alter: true });
module.exports = BlackData;
