const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require('../database/db')
const UnempVeriData = sequelize.define('unempveri', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personName: DataTypes.STRING,
    personID:DataTypes.STRING,
    jiezhen: DataTypes.STRING,
    verification: DataTypes.STRING,
    reviewoperator: DataTypes.STRING,
    checkoperator: DataTypes.STRING,
    checknote: DataTypes.STRING,
    reviewnote: DataTypes.STRING,
    alreadydelete: DataTypes.TINYINT,
    createtime: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        timezone: '+08:00'
    }
})

module.exports = UnempVeriData

