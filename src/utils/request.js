/*
  基于axios的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建一个axios实例,其实就是赋值一个axios
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // 定制后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据(未经处理的 JSON 格式字符串)
  transformResponse: [function (data) {
    // 后端返回的数据可能不是标准的 JSON 格式字符串
    // 如果不是，那么 JSONbig.parse 的调用就会报错
    // 所以我们使用 try-catch 来捕获异常,处理异常的发生
    try {
      // 转换成功，返回结果
      return JSONbig.parse(data)
    } catch (err) {
      // 转换失败，则进入这里
      // 将原数据原封不动返回
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 相应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载request模块
