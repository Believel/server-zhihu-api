const Router = require('koa-router')
const router = new Router()
var {
  index
} = require('../controllers/home')

router.get('/', index)

module.exports = router