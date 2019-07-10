const Koa = require("koa");
const koaBody = require("koa-body"); // 接收body请求体
const koaStatic = require('koa-static')
const error = require('koa-json-error') // json格式处理错误
const parameter = require('koa-parameter'); // 参数校验
const mongoose = require('mongoose')
const path = require('path')
// 创建一个Koa应用实例
var app = new Koa();
const routing = require("./routes");
const {
  connectionStr
} = require('./config')
const PORT = process.env.PORT || 3000;
const { getUploadDirName, getUploadFileName, getUploadFileExt, checkDirExist} = require('./utils/fileupload')

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
// 静态文件渲染
app.use(koaStatic(path.join(__dirname, 'public')))

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

app.use(koaBody({
  multipart: true, // 启用支持（multipart/form-data）文件格式
  // 配置更多关于multipart的选项
  formidable: {
    uploadDir: path.join(__dirname, 'public/uploads'),// 设置文件上传的目录
    keepExtensions: true,  // 保留文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传的大小
    // 文件上传前的设置
    onFileBegin: function(name, file) {
      //! name: 是表单的name属性传递过来的； file是一个File类型的对象
      //! 如果是多个文件上传：一次性上传的所有文件的name都设置为 `fileFiled[]`
      // 文件后缀
      const ext = getUploadFileExt(file.name)
      // 最终要保存到的文件夹目录
      const dirName = getUploadDirName()
      const dir = path.join(__dirname, `public/uploads/${dirName}`)
      // 检查文件夹是否存在，如果不存在就创建此文件夹
      checkDirExist(dir)
      // 获取文件名称
      const fileName = getUploadFileName(ext)
      // 重新覆盖 file.path 属性
      file.path = `${dir}/${fileName}`;
    }
  }
}));
app.use(parameter(app))
routing(app);

app.listen(PORT, () => {
  console.log(`程序运行在:http://localhost:${PORT}`);
});