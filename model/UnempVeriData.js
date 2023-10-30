const {DataTypes} = require('sequelize')
const sequelize = require('../database/db')
const UnempVeriData = sequelize.define('unempveri_copy1', {
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
    alreadydelete: {
        type:DataTypes.TINYINT,
        defaultValue:1
    },
    createtime: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        timezone: '+08:00'
    }
})

module.exports = UnempVeriData

