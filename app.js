const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koa_jwt = require('koa-jwt')
const index = require('./routes/index')
const users = require('./routes/users')
const contacts = require('./routes/contacts')
const unempVeri = require('./routes/unempVeri')
const BaseController = require('./controller/BaseController')
const log4j = require('./utils/log4j')
const util = require('./utils/util')
// error handler
onerror(app)
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async (ctx, next) => {
  await next().catch((err) => {
    log4j.debug(err)
    if (err.status == '401') {
      ctx.body = BaseController.renderJsonFail(util.CODE.AUTH_ERROR,'Token认证失败,请重新登录');
    } else {
      throw err;
    }
  });
});
// 请求认证

app.use(
  koa_jwt({ secret: 'jiading' }).unless({
    path: [/^\/api\/users\/login/],
  })
);

app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    ctx.body = BaseController.renderJsonFail(util.CODE.PARAM_ERROR,'数据请求路径错误');
  }

});

app.use(async (ctx, next) => {

  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = BaseController.renderJsonFail(util.CODE.AUTH_ERROR,'未授权');
    } else {
      throw err;
    }
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(unempVeri.routes(), unempVeri.allowedMethods())
app.use(contacts.routes(), contacts.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
