const path = require('path')
const { getUploadDirName } = require('../utils/fileupload')
class HomeCtroller {
  index(ctx) {
    a
    ctx.body = '哈哈'
  }
  // 上传文件
  upload(ctx) {
    //! 主要这里的filedFiled是表单中name属性的值
    //! 如果是单文件上传：ctx.request.files.fileField是一个File对象
    //! 如果是多文件上传：ctx.request.files.fileField是一个数组，每一项是一个File对象 

    // 假设前端 name="file" 是单文件的字段名
    //         name="file[]" 是多文件的字段名
    let file = ctx.request.files.file
    // 根据文件路径获取文件名
    const basename = path.basename(file.path)
    const dirName = getUploadDirName()
    // 返回文件地址链接 
    // TODO
    ctx.body = { url: `${ctx.origin}/uploads/${dirName}/${basename}` }
  }
}

module.exports = new HomeCtroller()