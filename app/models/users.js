const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})
// User 将成为mongoDB中的文档集合(collection)
module.exports = model('User', userSchema)