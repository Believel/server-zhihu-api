const Router = require('koa-router')
const jwt = require('koa-jwt')
const { secret } = require('../config')
// 创建一个以 /users 为前缀的路由
const router = new Router({
  prefix: '/questions'
})
var {
  find,
  findById,
  create,
  update,
  delete: deleteQuestion,
  checkQuestionExist,
  checkQuestioner
} = require('../controllers/questions')

// 使用koa-jwt中间件实现认证
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id', checkQuestionExist, findById)
router.post('/create', auth, create)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, deleteQuestion)


module.exports = router