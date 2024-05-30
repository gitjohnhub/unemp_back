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
  companyBankName: DataTypes.STRING,
  bankNumber: DataTypes.STRING,
  contactPerson: DataTypes.STRING,
  contactNumber: DataTypes.STRING,
  btmoney: DataTypes.STRING,
  caiyuanlv: DataTypes.STRING,
  jfrenci: DataTypes.STRING,
  jfmoney: DataTypes.STRING,
  sendPerson: DataTypes.STRING,
  status: DataTypes.STRING,
  companyCategory: DataTypes.STRING,
  note: DataTypes.STRING,
  createtime: DataTypes.STRING,
  confirmDate:DataTypes.STRING,
  checkDate:DataTypes.STRING,
  reviewDate:DataTypes.STRING,
});
wengangData.sync({ alter: true });

module.exports = wengangData;
