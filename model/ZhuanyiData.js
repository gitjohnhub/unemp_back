const {DataTypes} = require('sequelize')
const sequelize = require('../database/db')
const ZhuanyiData = sequelize.define('zhuanyi', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personName: DataTypes.STRING,
    personID:DataTypes.STRING,
    createtime: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        timezone: '+08:00'
    },
    fromArea:DataTypes.STRING,
    status:DataTypes.STRING,
    payDate:DataTypes.STRING,
    isOnlyTransferRelation:DataTypes.STRING,
    note:DataTypes.STRING,
    checkoperator:DataTypes.STRING,
    reviewoperator:DataTypes.STRING,
    isDeleted:{
      type:DataTypes.STRING,
      defaultValue:'1',
    },
    payMonth:DataTypes.STRING,
    pay: {
        type: DataTypes.STRING,
    }

})
ZhuanyiData.sync({ alter: true })
module.exports = ZhuanyiData

