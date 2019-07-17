const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const answerSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  // 回答者
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select:false },
  //! 从属于那个问题: 设计一对多关系（问题 vs 答案 = 1 v N）
  questionId: { type: String, required: true },
  // 投票数
  voteCount: { type: Number, required: true, default: 0 }
}, { timestamps: true})
// 'Answer' 将成为mongoDB中的文档集合(collection)
module.exports = model('Answer', answerSchema)  