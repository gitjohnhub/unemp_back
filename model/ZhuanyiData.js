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
const CalPayMonth = (payMonth) => {
    if (payMonth) {
      const numPayMonth = Number(payMonth);
      if (numPayMonth <= 12) {
        return numPayMonth * 2175 * 1.5;
      } else {
        return 12 * 2175 * 1.5 + (numPayMonth - 12) * 1740 * 1.5;
      }
    } else {
      return 0;
    }
  };
module.exports = ZhuanyiData

