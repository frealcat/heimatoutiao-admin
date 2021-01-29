<template>
  <div class="login-container">
<!--
      el-form 表单组件
      每个表单项都必须使用 el-form-item 组件包裹
-->
    <div class="login-head"></div>
    <el-form class="login-form" ref="form" :model="user">
      <el-form-item>
        <el-input placeholder="请输入手机号"
          v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入验证码"
        v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked">
          我已阅读并同意用户协议和隐私条款
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn"
         type="primary"
         :loading="loginLoading"
         @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'LoginIndex',
  compoments: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      checked: false, // 是否同意协议的选中状态
      loginLoading: false // 登录的 loading
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据
      const user = this.user

      // 表单验证

      // 验证通过,提交登录
      request({
        method: 'POST',
        url: ' /mp/v1_0/authorizations',
        // data1用来设置 POST 请求体
        data: user
      }).then(res => {
        console.log(res)
        // 登陆成功
        this.$notify({
          title: '成功',
          message: '登陆成功',
          type: 'success'
        })
      }).catch(err => {
        console.log('登录失败', err)
        this.$notify.error({
          title: '错误',
          message: '登录失败,手机号或验证码错误',
          duration: 2000
        })
      })
      // 处理后端响应结果
      //  成功：xxxx
      //  失败： xxxx
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-head {
    width: 300px;
    height: 57px;
    background: url('./logo_index.png') no-repeat;
    margin-bottom: 30px;
  }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
