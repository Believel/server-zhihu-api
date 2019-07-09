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
    ctx.body = `这是用户${ctx.params.id}:${user}的页面`
  }
  // 创建用户文档信息
  async createUser(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      }
    })
    const user = await new User(ctx.request.body).save()
    ctx.body = user
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
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204

  }
}
module.exports = new UsersContriller()