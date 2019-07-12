const Router = require('koa-router')
const jsonwebtoen = require('jsonwebtoken')
const {
  secret
} = require('../config')
// 创建一个以 /users 为前缀的路由
const router = new Router({
  prefix: '/users'
})
var {
  findUsers,
  findUser,
  createUser,
  deleteUser,
  checkOwner,
  updateUser,
  listFolling
} = require('../controllers/users')

// 编写认证中间件
const Auth = async (ctx, next) => {
  let {
    authorization = ''
  } = ctx.headers
  let token = authorization.replace('Bearer ', '');
  try {
    // 验证用户信息是否正确
    const user = jsonwebtoen.verify(token, secret);
    ctx.state.user = user
  } catch (err) {
    ctx.throw(401, err.message)
  }
  await next();
}
router.get('/', findUsers)
router.get('/:id', findUser)
router.post('/create', createUser)
router.patch('/:id', Auth, checkOwner, updateUser)
router.delete('/:id', Auth, checkOwner, deleteUser)
router.get('/:id/following', listFolling)

module.exports = router