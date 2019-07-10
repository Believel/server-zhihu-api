const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const {
  secret
} = require('../config')
class LoginController {
  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    let user = await User.findOne(ctx.request.body)
    console.log(user)
    if (!user) {
      ctx.throw(401, '用户名或者密码不正确')
    }
    // 用户和密码正确，生成token,发给前端
    const {
      _id,
      name
    } = user
    const token = jsonwebtoken.sign({
      _id,
      name
    }, secret, {
      expiresIn: '1d'
    })
    ctx.body = {
      token
    }
  }
}
module.exports = new LoginController()