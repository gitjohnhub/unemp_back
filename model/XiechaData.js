const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const XiechaData = sequelize.define('xiecha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personName: DataTypes.STRING,
  personID: DataTypes.STRING,
  canbaoInfo: DataTypes.JSON,
  unempInfo: DataTypes.JSON,
  createtime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    timezone: '+08:00',
  },
});
// XiechaData.sync({ alter: true });

module.exports = XiechaData;
