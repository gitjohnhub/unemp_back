const {DataTypes, DatabaseError} = require('sequelize')
const sequelize = require('../database/db')
const NongbuData = sequelize.define('nongbu', {
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
    applyDate:DataTypes.STRING,
    checkoperator:DataTypes.STRING,
    reviewoperator:DataTypes.STRING,
    status:DataTypes.STRING,
    chengPayMonth: DataTypes.STRING,
    zhenPayMonth:DataTypes.STRING,
    note:DataTypes.STRING,
    wrongTag:DataTypes.STRING,
    repeatTimes:DataTypes.STRING,
    originalFile:DataTypes.STRING,
    cancelUnemp:DataTypes.STRING,

})
NongbuData.sync({ alter: true })

module.exports = NongbuData

