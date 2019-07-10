const path = require('path')
const fs = require('fs')
module.exports = {
  /**
   * @description 检查文件夹是否存在，如果不存在就创建文件夹
   */
  checkDirExist: function(p) {
    if(!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  },
  /**
   * 得到上传文件夹的名字
   */
  getUploadDirName() {
    const date = new Date()
    let month = Number.parseInt(date.getMonth()) + 1;
    month = month.toString().length > 1 ? month : `0${month}`;
    const dir = `${date.getFullYear()}${month}${date.getDate()}`;
    return dir;
  },
  /**
   * 获取上传文件的后缀名
   * @param {string} name 
   */
  getUploadFileExt(name) {
    let ext = name.split('.')
    return ext[ext.length - 1]
  },
  /**
   * 获取上传文件名
   * @param {string} ext 
   */
  getUploadFileName(ext) {
    return `${Date.now()}${Number.parseInt(Math.random()*10000)}.${ext}`
  }
}