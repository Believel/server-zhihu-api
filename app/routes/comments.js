const Router = require('koa-router')
const jwt = require('koa-jwt')
const { secret } = require('../config')
// ! 三级嵌套
const router = new Router({
  prefix: '/questions/:questionId/answers/:answerId/comments'
})
var {
  find,
  findById,
  create,
  update,
  delete: deleteComment,
  checkCommentExist,
  checkCommentator
} = require('../controllers/comments')

// 使用koa-jwt中间件实现认证
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id', checkCommentExist, findById)
router.post('/:id', auth, create)
router.patch('/:id', auth, checkCommentExist, checkCommentator, update)
router.delete('/:id', auth, checkCommentExist, checkCommentator, deleteComment)


module.exports = router