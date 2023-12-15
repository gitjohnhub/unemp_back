const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const ProvinceData = sequelize.define('province', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: DataTypes.STRING,
  name: DataTypes.STRING,
});
// ProvinceData.sync({ alter: true })

module.exports = ProvinceData;
