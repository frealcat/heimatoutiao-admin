import Vue from 'vue'
import VueRouter from 'vue-router'

// 在VueVLI 创建的项目中 @ 表示 src 目录
// 它是src 目录的路径别名
// 好处：它不受当前文件路径影响
// 注意：@ 就是 src 路径，后面不要忘记写那个斜杠
// 建议：如果加载的资源在当前目录下，那就正常写，凡是需要进行路径查找的都是用 @
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish'
import Image from '@/views/image'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认子路由，这个名字没有意义
    // 正确的做法是：如果有默认子路由，就不要给父路由起名字
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空,会作为默认子路由
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫：所有页面的导航都会经过这里
// 守卫页面的导航的
// to: 要去的路由信息
// from: 来自哪里的路由信息
// next: 放行方法
router.beforeEach((to, from, next) => {
  // console.log('页面进来了')
  // 如果要访问的页面不是 /login ,则判断登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录,则允许通过

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，放行
      next()
    } else {
      // 未登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }

  // 允许通过
  // next()
})

export default router
