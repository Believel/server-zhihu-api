const Comment = require('../models/comments')
class CommentController {
  // 获取评论列表
  async find(ctx) {
    //! 分页
    let { per_page = 10 } = ctx.query
    let perPage = Math.max(per_page * 1, 1); // 每页数量
    let page = Math.max(ctx.query.page * 1, 1); // 请求页数
    //! limit(number) 查询结果的最大条数
    //! skip(number) 指定跳过的文档条数
    let q = new RegExp(ctx.query.q);
    const { questionId, answerId } = ctx.params
    const { rootCommentId } = ctx.query
    const commentList = await Comment
      .find({ content: q, questionId, answerId, rootCommentId }) // 检查内容是否满足q关键字, 并且精准匹配questionId,answerId(在路由参数中取出)
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('commentator replyTo')
    ctx.body = {
      data: {
        commentList
      }
    }
  }
  // 检验评论是否存在
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if(!comment) ctx.throw(404, '评论不存在')
    if(ctx.params.questionId && comment.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此评论')
    if(ctx.params.answerId && comment.answerId !== ctx.params.answerId) ctx.throw(404, '该答案下没有此评论')
    ctx.state.comment = comment
    await next()
  }
  // 查询特定评论
  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f=> ' +' + f).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
    ctx.body = comment
  }
  // 创建评论
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false },
    })
    // 新建评论
    const commentator = ctx.state.user._id;
    const { questionId, answerId } = ctx.params
    let comment = await new Answer({ ...ctx.request.body, commentator, answerId, questionId }).save()
    ctx.body = comment
  }
  // 检查评论者是否是当前登录用户
  async checkCommentator(ctx, next) {
    const { comment } = ctx.state;
    // 如果提问者不是当前登录的用户
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.status(403, '没有权限')
    }
    await next()
  }
  // 更新评论
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false}
    }) 
    // 只允许更新content
    const { content } = ctx.request.body
    await ctx.state.comment.update(content)
    ctx.body = ctx.state.comment
  }
  // 删除评论
  async delete(ctx) {
    const comment = await Comment.findByIdAndRemove(ctx.params.id);
    if (!comment) {
      ctx.throw(404, '答案不存在')
    }
    ctx.status = 204
  }
}
module.exports = new CommentController()