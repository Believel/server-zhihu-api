const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar_url: { type: String },
  introduction: { type: String, select:false }
}, { timestamps: true})
// 'Topic' 将成为mongoDB中的文档集合(collection)
module.exports = model('Topic', topicSchema)  