# 服务端联调准备

## 跨域处理

1. 安装跨域插件：安装跨域所使用的插件 egg-cors
> egg-core [文档地址](https://www.npmjs.com/package/egg-core)
``` bash
npm install egg-cors  -S
```
2. 开启插件：在 config/plugins.js 配置中开启插件
```js
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
```
3. 配置跨域源：在 config/config.default.js 配置中跨域源和跨域方式
```js
config.cors = {
  origin:'*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};
```

## post 请求处理

* csrf关闭：在 config/config.default.js 中关闭 egg 中的 csrf 配置
> CSRF是为了防止攻击，在发起请求前要在header里设置 x-csrf-token。x-csrf-token的值要后端取。post请求直接访问会报错404，目前还在早期开发阶段，处理这种问题就是关掉CSRF。[参考文档](https://eggjs.org/zh-cn/core/security.html#%E5%AE%89%E5%85%A8%E5%A8%81%E8%83%81-csrf-%E7%9A%84%E9%98%B2%E8%8C%83)
```js
 config.security = {
    csrf: {
      enable: false,
    },
  };
```

## MD5 接入

> 数据库中 user 表中的 password 是使用 md5加密后的内容，不能直接进行对比，需要在服务端加密后才能和数据库中的内容进行对比
1. 安装插件：在项目中安装 crypto
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

## 登录接口更新
 
1. 更新接口请求方式：修改 app/router 中 user/login 的请求方式
```js
router.post('/user/login', controller.user.index);
```
2. 编写登录逻辑：引入加密函数对接收到的参数进行加密后进行数据库查询，返回接口内容。
```js
async index() {
    const { ctx, app } = this
    let { username, password } = ctx.request.body
    password = md5(`${password}${PWD_SALT}`)
    const sql = `select * from user where username='${username}' and password = '${password}'`
    const user = await app.mysql.query(sql)
    if (user && user.length > 0) {
      const data = {
        code: 20000,
        data: user
      }
      ctx.body = data
    } else {
      ctx.body = { code: -1, msg: '用户名或密码错误，请检查后重新输入' }
    }
  }
```

## info 接口更新

> 模版文件中登录调用的是本地服务端的接口，获取到的内容和模版文件不一致，导致'user/info' 不能够正常获取到内容，为了不影响模版项目的运行需要添加 '/user/info'接口。其接口返回信息是从原接口文件中复制的。
1. 添加 info 请求：修改 app/router 中添加 user/info 的请求
```js
router.get('/user/info', controller.user.getInfo);
```
2. 配置接口响应：在 app/controller/user 中添加 getInfo函数
```js
async getInfo() {
    const { ctx } = this
    // 模拟vue-element-admin接口数据 确保能够进入到首页
    const data = {
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      introduction: 'I am a super administrator',
      name: 'Super Admin',
      roles: ['admin']
    }
    ctx.body = { code: 20000, data: data }
  }
```