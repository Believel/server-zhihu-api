var Koa = require('koa')
var app = new Koa()

app.use(async (ctx, next) => {
  console.log(ctx)
  await next()
})

// 路由中间件的作用：
// 1. 处理不同的URL
// 2. 处理不同的HTTP方法
// 3. 解析URL上的参数


app.listen(3000)