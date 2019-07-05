var Koa = require('koa')
var Router = require('koa-router')
// 创建一个Koa应用实例
var app = new Koa()
// 创建一个路由实例
var router = new Router()

// 创建一个以/users前缀的路由实例
const usersRouter = new Router({prefix: '/users'})

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