const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const contactData = sequelize.define('contacts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: DataTypes.STRING,
  contactPerson: DataTypes.STRING,
  phoneNum: DataTypes.STRING,
  address: DataTypes.STRING,
  mobileNum: DataTypes.STRING,
  belong: DataTypes.STRING,
  isPublic: DataTypes.STRING,
});
// contactData.sync({ alter: true })

module.exports = contactData;
