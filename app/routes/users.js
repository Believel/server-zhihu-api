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
  listFollowing, listFollwers,  follow, unfollow,
  checkUserExist,
  followTopic, unfollowTopic, listFollowingTopics,
  listQuestions,
  likingAnswer, unLikingAnswer, listLikingAnswers,
  disLikingAnswer, undisLikingAnswer,  listdisLikingAnswers,
  collectAnswer, unCollectAnswer, listCollectAnswers
} = require('../controllers/users')
var { checkTopicExist } = require('../controllers/topics')
var { checkAnswerExist } = require('../controllers/answers')

// 编写认证中间件
const Auth = async (ctx, next) => {
  let {
    authorization = ''
  } = ctx.headers
  let token = authorization.replace('Bearer ', '');
  try {
    // 验证用户信息是否正确
    const user = jsonwebtoen.verify(token, secret);
    // 存储用户的信息
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
router.get('/:id/following', listFollowing)
router.get('/:id/followers', listFollwers)
router.put('/following/:id', Auth, checkUserExist, follow)
router.delete('/following/:id', Auth, checkUserExist, unfollow)
// 最后id是话题的_id
router.put('/followingTopic/:id', Auth, checkTopicExist, followTopic)
router.delete('/followingTopic/:id', Auth, checkTopicExist, unfollowTopic)
router.get('/:id/followingTopic', listFollowingTopics)
// 获得用户问题列表
router.get('/:id/questions', listQuestions)
// 最后id是答案的_id (赞和踩是互斥关系)
router.put('/likingAnswer/:id', Auth, checkAnswerExist, likingAnswer, undisLikingAnswer)
router.delete('/likingAnswer/:id', Auth, checkAnswerExist, unLikingAnswer)
router.get('/:id/likingAnswer', listLikingAnswers)

router.put('/disLikingAnswer/:id', Auth, checkAnswerExist, disLikingAnswer, unLikingAnswer)
router.delete('/disLikingAnswer/:id', Auth, checkAnswerExist, undisLikingAnswer)
router.get('/:id/disLikingAnswer', listdisLikingAnswers)

router.put('/collectingAnswer/:id', Auth, checkAnswerExist, collectAnswer)
router.delete('/collectingAnswer/:id', Auth, checkAnswerExist, unCollectAnswer)
router.get('/:id/collectingAnswer', listCollectAnswers)
module.exports = router