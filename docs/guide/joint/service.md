# 联调工作集合

## 跨域处理

1. 安装跨域模块：安装跨域所使用的模块 egg-cors
   > egg-core [文档地址](https://www.npmjs.com/package/egg-core)

```bash
npm install egg-cors  -S
```

2. 开启模块：在 config/plugins.js 配置中开启模块

```js
exports.cors = {
  enable: true,
  package: 'egg-cors'
}
```

3. 配置跨域源：在 config/config.default.js 配置中跨域源和跨域方式

```js
config.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
}
```

## post 请求

- csrf 关闭：在 config/config.default.js 中关闭 egg 中的 csrf 配置
  > CSRF 是为了防止攻击，在发起请求前要在 header 里设置 x-csrf-token。x-csrf-token 的值要后端取。post 请求直接访问会报错 404，目前还在早期开发阶段，处理这种问题就是关掉 CSRF。[参考文档](https://eggjs.org/zh-cn/core/security.html#%E5%AE%89%E5%85%A8%E5%A8%81%E8%83%81-csrf-%E7%9A%84%E9%98%B2%E8%8C%83)

```js
config.security = {
  csrf: {
    enable: false
  }
}
```

## MD5 接入

> 数据库中 user 表中的 password 是使用 md5 加密后的内容，不能直接进行对比，需要在服务端加密后才能和数据库中的内容进行对比

1. 安装模块：在项目中安装 crypto

```bash
npm install crypto -S
```

2. 添加变量文件：创建 utils/constant.js 存放项目中使用的常量

```js
const PWD_SALT = 'node_egg_admin'
​
module.exports = {
  PWD_SALT
}
```

3. 封装加密函数：创建 utils/md5.js 封装加密函数

```bash
const crypto = require('crypto')
​
function md5(s) {
  return crypto.createHash('md5')
    .update(String(s)).digest('hex');
}
​
module.exports ={
  md5
}
```

## 生成 token

1. 安装模块：安装生成 token 需要的模块

```bash
npm install egg-jwt jsonwebtoken -S
```

2. 配置模块：在 config/plugins.js 中配置 egg-jwt

```js
exports.jwt = {
  enable: true,
  package: 'egg-jwt'
}
```

3. 使用模块：在 config/config.default.js 中使用模块

```js
const { PRIVATE_KEY } = require('../app/utils/constant')
// PRIVATE_KEY：node_egg_admin_key
config.jwt = {
  secret: PRIVATE_KEY
}
```

4. 创建 token 生成函数：在 app/utlis 中创建 token 文件

```js
const jwt = require('jsonwebtoken')

const { JWT_EXPIRED, PRIVATE_KEY } = require('./constant')

function generateToken(payload = {}, secret, expiresIn = JWT_EXPIRED) {
  return jwt.sign(payload, secret, { expiresIn })
}

module.exports = {
  generateToken
}
```

5. 通过登录接口返回 token 数据给前端

## login 接口配置

1. 更新接口请求方式：修改 app/router 中 user/login 的请求方式

```js
router.post('/user/login', controller.user.login)
```

2. 编写登录逻辑：引入加密函数对接收到的参数进行加密后进行数据库查询，返回接口内容。

```js
const { PWD_SALT } = require('../utils/constant')
const {  parseToken } = require('../utils/token')

async login() {
    const { ctx, app } = this
    let { username, password } = ctx.request.body
    password = md5(`${password}${PWD_SALT}`)
    const sql = `select * from user where username = '${username}' and password = '${password}'`
    try {
      const userData = await app.mysql.query(sql)
      if (userData && userData.length > 0) {
        const userId = userData[0].id
        const secret = app.config.jwt.secret
        const token = generateToken({ userId }, secret)
        const data = {
          code: 20000,
          data: { token }
        }
        ctx.body = data
      } else {
        ctx.body = { code: -1, msg: '用户名或密码错误，请检查后重新输入' }
      }
    } catch (e) {
      ctx.body = { code: -1, msg: '登录失败，失败原因：' + e.message }
      app.logger.error(e.name + ':login', e.message)
    }
  }
```

## user/info 接口

> 前端在 axios 的请求拦截中将请求头修改成 config.headers['authorization'] = `Bearer ${getToken()}`，jwt 默认验证请求头中的 authorization 信息

1. 添加 info 请求：修改 app/router 中添加 user/info 请求的 token 认证

```js
router.get('/user/info', app.jwt, controller.user.getUserInfo)
```

2. 配置接口响应：在 app/controller/user 中添加 getInfo 函数，解析请求头中的 token 信息获取用户信息。

```js
const { parseToken } = require('../utils/token')

async getUserInfo() {
    const { ctx, app } = this
    const token = ctx.get('authorization').split(' ')[1]
    const userId = parseToken(token).userId
    const sql = `select * from user where id = '${userId}'`
    try {
      const userList = await app.mysql.query(sql)
      if (userList && userList.length > 0) {
        const user = userList[0]
        const data = {
          avatar: user.avatar,
          introduction: user.nickname,
          name: user.username,
          roles: user.roles.split(',')
        }
        ctx.body = { code: 20000, data: data }
      } else {
        ctx.body = { code: -1, msg: '获取用户信息失败，失败原因：' }
      }
    } catch (e) {
      ctx.body = { code: -1, msg: '获取用户信息失败，失败原因：' + e.error }
      app.logger.error(e.name + ':getUserInfo', e.message)
    }
}
```

## token 过期处理

1. 创建中间件：在 app 下新建 middleware/jwtAuthorizedHandle.js

```js
module.exports = (options, app) => {
  return async function(ctx, next) {
    try {
      await next()
    } catch (err) {
      ctx.app.emit('error', err, ctx)
      const status = err.status || 500
      if (status === 401) {
        ctx.body = {
          code: 50008,
          msg: 'token 已经过期，请重新登录'
        }
      }
    }
  }
}
```

2. 全局使用中间件：在 config.default.js 中使用该中间价

```js
config.middleware = ['jwtAuthorizedHandle']
```
