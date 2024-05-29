// User.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

// 数据类型 https://www.sequelize.com.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: DataTypes.STRING,
  account: DataTypes.STRING,
  password: DataTypes.STRING,
  checkObject: DataTypes.STRING,
  checkJiezhen: DataTypes.STRING,
  role_id: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
});
// User.sync({ alter: true })

module.exports = User;
