const User = require('../models/users')
class UsersContriller {
  // 查询列表 —— 字段过滤(在设计表的时候设置 select:false 即可)
  async findUsers(ctx) {
    ctx.body = await User.find();
  }
  // 根据id查询用户表信息
  async findUser(ctx) {
    const { filelds } = ctx.query
    //! 添加过滤字段  
    // +filed 表示强制包含已经在 schema level 排除的字段
    let selectFields = filelds.split(';').filter(f => f).map(f => ' +' + f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields);
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
      password: {
        type: 'string',
        required: true
      }
    })
    let {
      name
    } = ctx.request.body;
    let repeatUser = await User.findOne({
      name
    })
    if (repeatUser) {
      ctx.throw(409, '用户已存在')
    }
    const user = await new User(ctx.request.body).save()
    let {
      _id
    } = user
    ctx.body = {
      _id,
      name
    }
  }
  // 授权
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  // 更新文档信息
  async updateUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url:{ type: 'string', required: false},
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType:'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object',  required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    })
    // findByIdAndUpdate相当于findOneAndUpdate，返回的是如果有就把找到的文档
    // new:true表示返回修改的文档而不是原始的文档
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true})
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
  // 获取关注者与粉丝
  async listFolling(ctx) {
    //! populate() 指定特定字段关联查询 
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user) ctx.throw(404);
    ctx.body = user.following;
  }
}
module.exports = new UsersContriller()