const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const UnempCheckData = sequelize.define('unempCheck', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personName: DataTypes.STRING,
  personID: DataTypes.STRING,
  jiezhen: DataTypes.STRING,
  createtime: DataTypes.STRING,
});
UnempCheckData.sync({ alter: true });

module.exports = UnempCheckData;
