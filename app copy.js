const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const koa_jwt = require('koa-jwt');
const index = require('./routes/index');
const users = require('./routes/users');
const unempVeri = require('./routes/unempVeri');
const BaseController = require('./controller/BaseController');
const log4j = require('./utils/log4j');
const util = require('./utils/util');
// error handler
onerror(app);
// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);

// logger
// app.use(async (ctx, next) => {
//   const start = new Date();
//   await next();
//   const ms = new Date() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

app.use(async (ctx, next) => {
  console.log(ctx)
  if (!ctx.url.startsWith('/api')) {
    ctx.url = '/api' + ctx.url;
    log4j.debug(`ctx.url:${ctx.url}`);
  }
});
// 请求认证
app.use(
  koa_jwt({ secret: 'jiading' }).unless({
    path: [/^\/api\/users\/login/],
  })
);
app.use(async (ctx, next) => {
  await next();
  log4j.debug(ctx)
  if (ctx.status === 404) {
    log4j.debug('404')
    ctx.body = BaseController.renderJsonFail(util.CODE.PARAM_ERROR, '数据请求路径有误');
  }

});
app.use(async (ctx, next) => {
  try {
    await next()
  }catch{(err) => {
    if (err.status === 401) {
      log4j.debug('401')

      ctx.status = 401;
      ctx.body = BaseController.renderJsonFail(util.CODE.AUTH_ERROR, 'Token认证失败,请重新登录');
    } else {
      log4j.debug('500')

      ctx.status = 500;
      ctx.body = BaseController.renderJsonFail(util.CODE.BUSINESS_ERROR, '服务器内部错误');
    }
  }};
});
// await next().catch((err) => {
//   log4j.debug(err);
//   if (err.status == '401') {
//     ctx.body = BaseController.renderJsonFail(util.CODE.AUTH_ERROR, 'Token认证失败,请重新登录');
//   } else {
//     log4js.debug(err);
//   }
// });

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(unempVeri.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
