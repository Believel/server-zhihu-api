const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose
//! timestamp设置为true,mongoose会增加createAt和updateAt属性 
const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  // 评论人
  commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select:false },
  //! 从属于那个问题: 设计一对多关系（问题 vs 答案 = 1 v N）
  questionId: { type: String, required: true },
  //! 在哪个答案下面评论: 设计一对多关系(答案 vs 评论 = 1 v N)
  answerId: { type: String, required: true },
  // 一级评论id(即答案的评论)
  rootCommentId: { type: String },
  // 二级评论id(即评论的评论)
  // 回复给哪个用户
  replyTo: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true})
// 'Comment' 将成为mongoDB中的文档集合(collection)
module.exports = model('Comment', commentSchema)  