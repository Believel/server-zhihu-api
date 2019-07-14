const Topic = require('../models/topics')
class TopicsContriller {
  // 获取话题列表
  async find(ctx) {
    //! 分页
    let { per_page = 10 } = ctx.query
    let perPage = Math.max(per_page * 1, 1); // 每页数量
    let page = Math.max(ctx.query.page * 1, 1); // 请求页数
    //! limit(number) 查询结果的最大条数
    //! skip(number) 指定跳过的文档条数
    const topicList = await Topic
      .find({ name: new RegExp(ctx.query.q)})
      .limit(perPage)
      .skip((page - 1) * perPage);
    ctx.body = {
      data: {
        topicList
      }
    }
  }
  // 查询特定话题
  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f=> ' +' + f).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  // 创建话题
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true},
      avatar_url: { type: 'string', required: false }
    })
    // 查询话题标题是否存在
    let { name } = ctx.request.body
    let findOneTopic = await Topic.findOne({ name})
    if(findOneTopic) {
      ctx.throw(404, '该话题已经存在')
    }
    // 新建话题
    let topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  // 更新话题
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false},
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    let topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if(!topic) {
      ctx.throw(404, '话题不存在')
    }
    ctx.body = topic
  }
}
module.exports = new TopicsContriller()