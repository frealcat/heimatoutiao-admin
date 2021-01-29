/* 
  基于axios的请求模块
*/
import axios from 'axios'

// 创建一个axios实例,其实就是赋值一个axios
const request = axios.create({
  baseURL:' http://ttapi.research.itcast.cn/' //请求的基础路径
})

export default request

// 谁要使用谁就加载request模块
