var Koa = require('koa')
var app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'hello zhihu'
  await next()
})



app.listen(3000)