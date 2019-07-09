const User = require('../models/users')
class UsersContriller {
  // 查询列表
  async findUsers(ctx) {
    ctx.body = await User.find();
  }
  // 根据id查询用户表信息
  async findUser(ctx) {

    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  // 创建用户文档信息
  async createUser(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: { type: 'string', required: true }
    })
    let {name} = ctx.request.body;
    let repeatUser =await User.findOne({ name })
    if (repeatUser) {
      ctx.throw(409, '用户已存在')
    }
    const user = await new User(ctx.request.body).save()
    let  {_id} = user
    ctx.body = {_id, name}
  }
  // 更新文档信息
  async updateUser(ctx) {
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  // 删除
  async deleteUser(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204

  }
}
module.exports = new UsersContriller()