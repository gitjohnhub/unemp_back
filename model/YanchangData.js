const {DataTypes} = require('sequelize')
const sequelize = require('../database/db')
const YanchangData = sequelize.define('yanchang', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personName: DataTypes.STRING,
    personID:DataTypes.STRING,
    jiezhen:DataTypes.STRING,
    createtime: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        timezone: '+08:00'
    },
    checkoperator:DataTypes.STRING,
    reviewoperator:DataTypes.STRING,
    status:DataTypes.STRING,
    startDate:DataTypes.STRING,
    payMonth: {
        type: DataTypes.STRING,
    },
    endDate:DataTypes.STRING,
    note:DataTypes.STRING,
    originalFile:DataTypes.STRING,
    wrongTag:DataTypes.STRING,

})
YanchangData.sync({ alter: true })

module.exports = YanchangData

