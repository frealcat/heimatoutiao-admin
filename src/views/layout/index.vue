<template>
  <el-container class="layout-container">
    <el-aside width="auto"
    class="aside">
    <app-aside class="aside-menu"
    :is-collapse='isCollapse'
    />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i :class="{
            'el-icon-s-fold': isCollapse,
            'el-icon-s-unfold': !isCollapse
          }"
          @click="isCollapse = !isCollapse"
          ></i>
          <span>江苏创智博客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{ user.name ? user.name : '未登录' }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人设置</el-dropdown-item>
          <!--
            组件默认不识别原生事件的，除非内部做了处理
           -->
          <el-dropdown-item
          @click.native="onLogout"
          >退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏的展示状态
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化完毕，获取用户资料
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    // 除了登录接口，其他所有接口都需要授权才能请求使用
    // 或者说，除了登录接口，其他接口都需要身份令牌·才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },

    onLogout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        // 清空用户登录状态
        window.localStorage.removeItem('user')

        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        return () => {}
      })
    }
  }
}
</script>

<style lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}

.header {
  // background-color: #b3c0d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #ccc;
}

.main {
  background-color: #e9eef3;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}
</style>
