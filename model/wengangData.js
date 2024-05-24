const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const wengangData = sequelize.define('wengang', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: DataTypes.STRING,
  canbaoCode: DataTypes.STRING,
  companyCode: DataTypes.STRING,
  companyOnlyCode: DataTypes.STRING,
  bankName: DataTypes.STRING,
  compangBankName: DataTypes.STRING,
  bankNumber: DataTypes.STRING,
  contactPerson: DataTypes.STRING,
  contactNumber: DataTypes.STRING,
  person1: DataTypes.STRING,
  person2: DataTypes.STRING,
  person3: DataTypes.STRING,
  person4: DataTypes.STRING,
  person5: DataTypes.STRING,
  money: DataTypes.STRING,
  sendPerson: DataTypes.STRING,
  status: DataTypes.STRING,
  companyCategory: DataTypes.STRING,
  note: DataTypes.STRING,
  createtime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    timezone: '+08:00',
  },
});
// wengangData.sync({ alter: true });

module.exports = wengangData;
