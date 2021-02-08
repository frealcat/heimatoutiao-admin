/*
  基于axios的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
// 非组件模块可以这样加载使用element 的 message 提示组件
import { Message } from 'element-ui'

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

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // 所有响应码为 2xx 的响应都会进入这里
    return response
  },
  function (error) {
    // 所有超出 2xx 的响应码都会进入这里
    const { status } = error.response.status
    if (status === 401) {
      // 跳转到登录页
      // 清除本地存储中的用户登录状态
      window.localStorage.removeItem('user')
      router.push('/login')
      Message('登录状态无效，请重新登录')
    } else if (status === 403) {
      // token 未携带或已过期
      Message({
        type: 'warning',
        message: '没有操作权限'
      })
    } else if (status >= 500) {
      // 服务端错误
      Message.error('服务端内部异常，请稍后重试')
    } else if (status === 400) {
      // 客户端参数错误
      Message.error('请求参数错误，请检查参数')
    }
    return Promise.reject(error)
  }
)

// 导出请求方法
export default request

// 谁要使用谁就加载request模块
