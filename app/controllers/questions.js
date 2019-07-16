const Question = require('../models/questions')
const User = require('../models/users')
class TopicsContriller {
  // 获取问题列表
  async find(ctx) {
    //! 分页
    let { per_page = 10 } = ctx.query
    let perPage = Math.max(per_page * 1, 1); // 每页数量
    let page = Math.max(ctx.query.page * 1, 1); // 请求页数
    //! limit(number) 查询结果的最大条数
    //! skip(number) 指定跳过的文档条数
    //! $or是可以匹配多个文档字段
    let q = new RegExp(ctx.query.q);
    const topicList = await Question
      .find({ $or: [{ title: q }, { description: q }]})
      .limit(perPage)
      .skip((page - 1) * perPage);
    ctx.body = {
      data: {
        topicList
      }
    }
  }
  // 检验问题是否存在
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    ctx.state.question = question
    if(!question) ctx.throw(404, '问题不存在')
    await next()
  }
  // 查询特定问题
  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f=> ' +' + f).join('')
    const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
    ctx.body = question
  }
  // 创建问题
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true},
      description: { type: 'string', required: false }
    })
    // 查询问题标题是否存在
    let { title } = ctx.request.body
    let findOneQuestion = await Question.findOne({ title})
    if(findOneQuestion) {
      ctx.throw(404, '该问题已经存在')
    }
    // 新建问题
    let question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
    ctx.body = question
  }
  // 检查提问者是否是当前的登录用户
  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    // 如果提问者不是当前登录的用户
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.status(403, '没有权限')
    }
    await next()
  }
  // 更新问题
  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false},
      description: { type: 'string', required: false }
    })
    // let question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    // if(!question) {
    //   ctx.throw(404, '问题不存在')
    // }

    //! 在检查问题是否存在时存储了一份question,直接使用就行了 
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }
  // 删除问题
  async delete(ctx) {
    const question = await Question.findByIdAndRemove(ctx.params.id);
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.status = 204
  }
}
module.exports = new TopicsContriller()