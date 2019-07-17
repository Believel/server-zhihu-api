const Router = require('koa-router')
const jwt = require('koa-jwt')
const { secret } = require('../config')
// 创建一个以 /users 为前缀的路由
const router = new Router({
  prefix: '/questions/:questionId/answers'
})
var {
  find,
  findById,
  create,
  update,
  delete: deleteAnswer,
  checkAnswerExist,
  checkAnswerer
} = require('../controllers/answers')

// 使用koa-jwt中间件实现认证
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id', checkAnswerExist, findById)
router.post('/:id', auth, create)
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update)
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, deleteAnswer)


module.exports = router