/**
 * npm install --save sequelize
 */

const Sequelize = require("sequelize")
const config = require('./config')

console.log('init sequelize...')

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.hostname,
    port: config.hostport,
    dialect: 'mysql',
    pool: {
        max: 8, // 连接池最大连接数量
        min: 0, // 最小连接数量
        idle: 10000 // 如果一个线程10s内没有被用过就释放
    },
    define: {
        // schema和schemaDelimiter为表前缀，不需要可以删除
        // schema: 'koa',
        // 连接字符
        // schemaDelimiter: '-',
        // 是否自动添加时间戳
        timestamps: false,
        freezeTableName: true
    },
    timezone: '+08:00'
})


// 测试是否能连通
sequelize.authenticate().then(() => {
    console.log("连接成功");
}).catch(err => {
    console.log("连接失败", err);
});


module.exports = sequelize
