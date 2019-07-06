var Koa = require('koa')
var Router = require('koa-router')
// 创建一个Koa应用实例
var app = new Koa()
// 创建一个路由实例
var router = new Router()

<<<<<<< HEAD
app.use(async (ctx, next) => {
  console.log(ctx)
  await next()
})

// 路由中间件的作用：
// 1. 处理不同的URL
// 2. 处理不同的HTTP方法
// 3. 解析URL上的参数
=======
// 创建一个以/users前缀的路由实例
const usersRouter = new Router({prefix: '/users'})
>>>>>>> b69af665d3b8616fb6dc419659f7585d016231c6

router.get('/', (ctx, next) => {
  ctx.body = '哈哈'
})
usersRouter.get('/', (ctx)=> {
  ctx.body = '这是用户页面'
})
usersRouter.get('/:id', (ctx)=> {
  ctx.body = `这是用户${ctx.params.id}的页面`
})
app.use(usersRouter.routes())
app.use(router.routes())

app.listen(3000)