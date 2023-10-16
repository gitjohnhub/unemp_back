const config = require("./config")
const mysql = require('mysql2')

const pool = mysql.createPool({
  host: config.hostname, // 地址
  port: config.hostport, // 端口号
  user: config.username, // 用户名
  password: config.password, // 密码
  database: config.database, // 目标数据库
})
exports.query = function (sql){
  return new Promise((resolve, reject) => {
    pool.execute(sql, (err, results) => {
        if (err) reject(err);
        resolve(results);
    });
  });
}