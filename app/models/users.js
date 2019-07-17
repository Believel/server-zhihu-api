const mongoose = require('mongoose')
const {
  Schema,
  model
} = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  // 密码不显示
  password: { type: String, required: true, select: false },
  // 头像
  avatar_url: { type: String },
  // 性别
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },
  // 一句话介绍
  headline: { type: String },
  // 居住地
  locations: { type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false},
  // 所在行业
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false},
  // 职业经历
  employments: {
    type: [{
      company:{ type: Schema.Types.ObjectId, ref: 'Topic' },
      job: { type: Schema.Types.ObjectId, ref: 'Topic' }
    }],
    select: false
  },
  // 教育经历
  educations:{
    type: [{
      school: { type: Schema.Types.ObjectId, ref: 'Topic' },
      major: { type: Schema.Types.ObjectId, ref: 'Topic' },
      diploma: { type:Number, enum:[1, 2, 3, 4, 5] },
      entrance_year: { type:Number },
      graducation_year: { type: Number }
    }],
    select: false
  },
  // 关注人
  following: {
    //! 存储用户id, 引用User集合
    type:[{ type: Schema.Types.ObjectId, ref: "User" }],
    select: false
  },
  // 关注话题
  followingTopics: {
    type:[{ type: Schema.Types.ObjectId, ref: "Topic" }],
    select: false
  },
  // 赞答案
  likingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },
  // 踩过的答案
  disLikingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },
  // 收藏答案
  collectingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  }
})
// 'User' 将成为mongoDB中的文档集合(collection)
module.exports = model('User', userSchema)  