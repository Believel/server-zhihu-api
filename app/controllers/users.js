class UsersContriller {
  findUsers(ctx) {
    ctx.body = '这是用户页面'
  }
  findUser(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      age: {
        type: 'string',
        required: true
      }
    })
    ctx.body = `这是用户${ctx.params.id}的页面`
  }
  createUser(ctx) {

    ctx.body = `创建用户`
  }
}
module.exports = new UsersContriller()