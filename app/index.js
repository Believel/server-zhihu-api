const Koa = require("koa");
const bodyParser = require("koa-bodyparser"); // 接收body请求体
const error = require('koa-json-error') // json格式处理错误
const parameter = require('koa-parameter'); // 参数校验
const mongoose = require('mongoose')
// 创建一个Koa应用实例
var app = new Koa();
const routing = require("./routes");
const {
  connectionStr
} = require('./config')
const PORT = process.env.PORT || 3000;

mongoose.connect(connectionStr, {
  useNewUrlParser: true
}, () => console.log('MongoDB 连接成功'))
mongoose.connection.on('error', console.error)
// 错误处理中间件，其中404错误捕捉不到
// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (error) {
//     ctx.status = error.status || error.statusCode || 500;
//     ctx.body = {
//       message: error.message
//     };
//   }
// });
// 指定错误堆栈信息在开发环境显示，在生产环境不显示
app.use(error({
  postFormat: (e, {
    stack,
    ...rest
  }) => process.env.NODE_ENV === 'production' ? rest : {
    stack,
    ...rest
  }
}))

app.use(bodyParser());
app.use(parameter(app))
routing(app);

app.listen(PORT, () => {
  console.log(`程序运行在:http://localhost:${PORT}`);
});