const Router = require('koa-router')
const jwt = require('koa-jwt')
const { secret } = require('../config')
// 创建一个以 /users 为前缀的路由
const router = new Router({
  prefix: '/topics'
})
var {
  find,
  findById,
  create,
  update
} = require('../controllers/topics')

// 使用koa-jwt中间件实现认证
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id', findById)
router.post('/:id', auth, create)
router.patch('/:id', auth,  update)

module.exports = router