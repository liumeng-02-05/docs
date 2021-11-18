# 添加路由

1. 添加接口文件：在 app/controller 下添加 user.js
```js
'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  async index() {
    const { ctx } = this
      ctx.body = { code: -1, msg: 'user/login 接口测试' }
  }

module.exports = UserController
```
2. 添加接口配置：在 app/router 中配置 user/login 端口
```js
router.get('/user/login', controller.user.index);
```
3. 接口测试：在地址栏输入接口地址进行测试 (http://127.0.0.1/user/login)
