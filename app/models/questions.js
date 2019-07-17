const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String },
  questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select:false },
  // 存储问题的话题信息
  topics: { 
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic',}], 
    select: false
  }
}, { timestamps: true})
// 'Topic' 将成为mongoDB中的文档集合(collection)
module.exports = model('Question', questionSchema)  