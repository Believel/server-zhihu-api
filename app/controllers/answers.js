const Answer = require('../models/answers')
const User = require('../models/users')
class AnswerController {
  // 获取答案列表
  async find(ctx) {
    //! 分页
    let { per_page = 10 } = ctx.query
    let perPage = Math.max(per_page * 1, 1); // 每页数量
    let page = Math.max(ctx.query.page * 1, 1); // 请求页数
    //! limit(number) 查询结果的最大条数
    //! skip(number) 指定跳过的文档条数
    let q = new RegExp(ctx.query.q);
    const questionList = await Answer
      .find({ content: q, questionId: ctx.params.questionId }) // 检查内容是否满足q关键字, 并且精准匹配questionId(在路由参数中取出)
      .limit(perPage)
      .skip((page - 1) * perPage);
    ctx.body = {
      data: {
        questionList
      }
    }
  }
  // 检验答案是否存在
  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if(!answer) ctx.throw(404, '答案不存在')
    //! 只有在删改查答案才执行此逻辑， 赞和踩答案时候不检查此逻辑。
    // 还得检查”答案”是否在这条“问题”下面
    if(ctx.params.questionId && answer.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此答案')
    ctx.state.answer = answer
    await next()
  }
  // 查询特定答案
  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f=> ' +' + f).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    ctx.body = answer
  }
  // 创建答案
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    // 新建答案
    const answerer = ctx.state.user._id;
    const { questionId } = ctx.params
    let answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save()
    ctx.body = answer
  }
  // 检查回答者是否是登录用户
  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state;
    // 如果提问者不是当前登录的用户
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.status(403, '没有权限')
    }
    await next()
  }
  // 更新答案
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false}
    }) 
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }
  // 删除答案
  async delete(ctx) {
    const answer = await Answer.findByIdAndRemove(ctx.params.id);
    if (!answer) {
      ctx.throw(404, '答案不存在')
    }
    ctx.status = 204
  }
}
module.exports = new AnswerController()