var Koa = require('koa')
var Router = require('koa-router')
// 创建一个Koa应用实例
var app = new Koa()
// 创建一个路由实例
var router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = '哈哈'
})

app.use(router.routes())

app.listen(3000)