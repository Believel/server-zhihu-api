const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
class UsersController {
  // 查询列表 —— 字段过滤(在设计表的时候设置 select:false 即可)
  async findUsers(ctx) {
    let { per_page = 10 } = ctx.query
    let perPage = Math.max(per_page * 1, 1); // 每页数量
    let page = Math.max(ctx.query.page * 1, 1); // 请求页数
    ctx.body = await User
      .find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip((page - 1) * perPage);
  }
  // 根据id查询用户表信息
  async findUser(ctx) {
    const { filelds= '' } = ctx.query
    //! 添加过滤字段  
    //! +filed 表示强制包含已经在 schema level 排除的字段
    let selectFields = filelds.split(';').filter(f => f).map(f => ' +' + f).join('')
    //! populate() 指定特定字段关联查询,多个字段使用空格隔开(注意：要在设计Schema时将这个字段设置为某个文档的引用例如：locations: { type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false},) 
    let populateStr = filelds.split(';').filter(f => f).map(f => {
      if(f === 'employments') {
        return 'employments.company employments.job'
      } else if(f === 'educations') {
        return 'educations.school educations.major'
      } else {
        return f
      }
    }).join(' ')
    const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr);
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  // 创建用户文档信息
  async createUser(ctx) {
    // 1. 校验参数
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
    // 新建用户，并保持到数据库
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
  // 更新用户文档信息
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
  // 获取某个人的关注的人列表
  async listFollowing(ctx) {
    //! populate() 指定特定字段关联查询,多个字段使用空格隔开 
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user) ctx.throw(404);
    ctx.body = user.following;
  }
  // 获取粉丝列表
  async listFollwers(ctx) {
    //! 只有关注了你才能是你的粉丝
    //? 为什么字段following是数组，可以这样根据对象形式查询following 字段
    // 从所有用户列表中查找自己是否在他们各自的fllowing字段中，也就是说是否有人关注了我
    const users = await User.find({following: ctx.params.id})
    ctx.body = users
  }
  // 检验用户存在与否
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id) 
    if(!user) ctx.throw(404, '用户不存在')
    await next()
    
  }
  // 关注某人
  async follow(ctx) {
    // 获取我的关注列表
    const me = await User.findById(ctx.state.user._id).select('+following');
    // 如果不在我的关注列表中就push进去
    if(!me.following.map(id=> id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      // 保存到数据库中
      me.save();
    }
    ctx.status = 204;
  }
  // 取消关注
  async unfollow(ctx) {
    let me = await User.findById(ctx.state.user._id).select('+following');
    let index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }
  // 关注话题
  async followTopic(ctx) {
    // 获取我的关注列表
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    // 如果不在我的关注列表中就push进去
    if(!me.followingTopics.map(id=> id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      // 保存到数据库中
      me.save();
    }
    ctx.status = 204;
  }
  // 取消关注话题
  async unfollowTopic(ctx) {
    let me = await User.findById(ctx.state.user._id).select('+followingTopics');
    let index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.followingTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }
  // 获取某个人的关注的话题列表
  async listFollowingTopics(ctx) {
    //! populate() 指定特定字段关联查询,多个字段使用空格隔开 
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if(!user) ctx.throw(404);
    ctx.body = user.followingTopics;
  }
  // 用户问题列表
  async listQuestions(ctx) {
    const questions = await Question.find({questioner: ctx.params.id})
    ctx.body = questions
  }
  // 点赞答案
   async likingAnswer(ctx, next) {
    // 获取我的点赞列表
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    // 如果不在我的点赞列表中就push进去
    if(!me.likingAnswers.map(id=> id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      // 保存到数据库中
      me.save();
      //! 修改答案的投票数（增加1）
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1} } )
    }
    ctx.status = 204;
    await next();
  }
  // 取消点赞答案
  async unLikingAnswer(ctx) {
    let me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    let index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      // ! 修改答案的投票数（减少1）
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1}})
    }
    ctx.status = 204;
  }
  // 获取某个人的喜欢的答案列表
  async listLikingAnswers(ctx) {
    //! populate() 指定特定字段关联查询,多个字段使用空格隔开 
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    if(!user) ctx.throw(404);
    ctx.body = user.likingAnswers;
  }
  // 踩答案
  async disLikingAnswer(ctx, next) {
    // 获取我的点赞列表
    const me = await User.findById(ctx.state.user._id).select('+disLikingAnswers');
    // 如果不在我的点赞列表中就push进去
    if(!me.disLikingAnswers.map(id=> id.toString()).includes(ctx.params.id)) {
      me.disLikingAnswers.push(ctx.params.id);
      // 保存到数据库中
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  // 取消踩答案
  async undisLikingAnswer(ctx) {
    let me = await User.findById(ctx.state.user._id).select('+disLikingAnswers');
    let index = me.disLikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.disLikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 获取某个人的踩答案列表
  async listdisLikingAnswers(ctx) {
    //! populate() 指定特定字段关联查询,多个字段使用空格隔开 
    const user = await User.findById(ctx.params.id).select('+disLikingAnswers').populate('disLikingAnswers')
    if(!user) ctx.throw(404);
    ctx.body = user.disLikingAnswers;
  }
  // 收藏答案
  async collectAnswer(ctx, next) {
    // 获取我的收藏列表
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    // 如果不在我的收藏列表中就push进去
    if(!me.collectingAnswers.map(id=> id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id);
      // 保存到数据库中
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  // 取消收藏答案
  async unCollectAnswer(ctx) {
    let me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    let index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 获取某个人的收藏答案列表
  async listCollectAnswers(ctx) {
    //! populate() 指定特定字段关联查询,多个字段使用空格隔开 
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers')
    if(!user) ctx.throw(404);
    ctx.body = user.collectingAnswers;
  }
}
module.exports = new UsersController()