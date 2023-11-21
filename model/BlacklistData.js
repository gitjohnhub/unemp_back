const {DataTypes} = require('sequelize')
const sequelize = require('../database/db')
const BlacklistData = sequelize.define('blacklist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personName: DataTypes.STRING,
    personID:DataTypes.STRING,
    source:DataTypes.STRING,
    status:DataTypes.STRING,
    note:DataTypes.STRING,
    checkoperator:DataTypes.STRING,
    reviewoperator:DataTypes.STRING,
    isDeleted:{
      type:DataTypes.STRING,
      defaultValue:'1',
    },
    pay: {
        type: DataTypes.STRING,
    },
    payMonth:DataTypes.STRING,
    payDate:DataTypes.STRING,
    createtime: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        timezone: '+08:00'
    },
})
BlacklistData.sync({ alter: true })
module.exports = BlacklistData

