const Router = require('koa-router')
// 创建一个以 /users 为前缀的路由
const router = new Router({
  prefix: '/users'
})
var {
  findUsers,
  findUser,
  createUser,
  deleteUser
} = require('../controllers/users')

router.get('/', findUsers)
router.get('/:id', findUser)
router.post('/create', createUser)
router.delete('/:id', deleteUser)

module.exports = router