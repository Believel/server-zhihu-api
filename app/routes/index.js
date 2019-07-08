const fs = require('fs')
/**
 * 批量的导出注册的router
 */

module.exports = (app) => {
  // 同步的读取指定目录下的所有文件，并返回所有文件名
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;
    let router = require(`./${file}`)
    app.use(router.routes())
    app.use(router.allowedMethods())
  })
}