const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  // 密码不显示
  password: { type: String, required: true, select: false }
})
// 'User' 将成为mongoDB中的文档集合(collection)
module.exports = model('User', userSchema)