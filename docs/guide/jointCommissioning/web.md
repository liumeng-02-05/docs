
# 前端联调准备

## 更新请求接口


1. 修改请求 url ：修改 src/api/user 中 login的 url
```js
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
```
2. 修改请求端口：修改 src/utils/request.js 中的请求地址

> 服务端接口现阶段只配置了 'user/login' 其他接口暂时还没有添加，所以这里只针对 'user/login' 进行了处理，为了不影响整个项目的运行，后面对 '/user/info' 也进行了相同的操作 即 'user/login' 和 '/user/info' 访问的是本地服务端接口，其他接口还是正常使用模版项目中的接口，
```js
service.interceptors.request.use(
  config => {
    if (config.url === '/user/login' || config.url === '/user/info') {
      config.baseURL = 'http://localhost:7001/'
    }
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
``` 
3. 响应结果处理：对接口中返回的响应信息进行处理

> 我将响应信息错误信息中的的 message 该成了 msg,这里的 code 也可以根据你的需要进行修改，当然你也可以选择不对响应信息进行处理，相对应的服务端返回的信息就要和这里的变量保持一致。即 code 需要等于 20000 ，返回的自定义信息需要为message。 下面的响应逻辑你也可以根据自己需要进行修改
```js
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      ...
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
```


## 登录组件调整


1. 清空默认内容：清空模版项目中默认指定的用户名和密码
```js
data() {
  return{
    loginForm: {
        username: '',
        password: ''
      },
  } 
}
```
2. 校验规则修改：修改模版项目中的用户名校验规则, 校验规则文件：src/utils/validate.js

> 模版文件中用户名使用的是自定义校验指定了必须为 'admin' 或 'editor', 你可以根据需要在这里添加自定义规则。我这里为了方便测试就简单的添加了可以通过的用户名。
```js
export function validUsername(str) {
  const valid_map = ['testuser', 'admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
```
3. 登录页面修改：修改登录页面中登录按钮下方的提示类信息,让登录页面更加整洁
> 这里的内容可以根据自己的需要进行使用。
```js
<div style="position:relative">
  <div class="tips">
    <span>Username : admin</span>
    <span>Password : any</span>
  </div>
  <div class="tips">
    <span style="margin-right:18px;">Username : editor</span>
    <span>Password : any</span>
  </div>
  <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
  Or connect with
  </el-button>
</div>
```


