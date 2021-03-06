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
  update,
  checkTopicExist,
  listFollwers,
  listQuestions
} = require('../controllers/topics')

// 使用koa-jwt中间件实现认证
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id',checkTopicExist, findById)
router.post('/:id', auth, create)
router.patch('/:id', auth, checkTopicExist, update)
// router.delete('/:id', auth,  deleteTopic)
// 话题关注者列表   :id是话题_id
router.get('/:id/followers', checkTopicExist,listFollwers)
// 话题的问题列表
router.get('/:id/questions', checkTopicExist, listQuestions)

module.exports = router