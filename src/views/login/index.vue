<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
    </div>
    <!--
    配置form表单验证:
      1.必须给el-form 组件绑定 model 为表单数据对象
      2.给需要验证的表单字项 el-form-item 绑定prop属性
        注意： prop属性需要指定表单对象中的数据名称
      3.给 el-form 组件的 rules 属性配置验证规则

    手动触发表单验证：
      1. 给el-form 设置 ref ，起个名字(随便起名，不重复即可
      2. 通过ref 获取 el-form 组件 调用组件的 validate 进行验证
     -->
    <el-form class="login-form" ref="login-form"
    :model="user" :rules="formRules">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loginLoading"
        class="login-btn" type="primary" @click="onLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  compoments: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },
      loginLoading: false, // 登录的 loading
      formRules: { // 表单验证的规则设置
        // 要验证的数据名称：规则列表 []
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|5|5|7|8|9]\d{9}$/, message: '请输入正确格式的号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确格式的验证码' }
        ],
        agree: [
          {
            // 自定义验证规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据
      // const user = this.user

      // 表单验证
      // validate 方法是异步的
      this.$refs['login-form'].validate((valid, err) => {
        // 如果表单验证失败，停止提交请求
        if (!valid) {
          return
        }

        // 验证通过,提交登录
        this.login()
      })
    },
    login () {
      // 开始登录中loading
      this.loginLoading = true

      // 对于代码中的请求操作
      // 1. 接口请求可能需要重用
      // 2. 实际工作中，接口非常容易变动，改起来麻烦
      // 我们建议的做法是把所有的请求都封装成函数然后统一的组织到模块中进行管理
      // 这样做的好处就是：管理、维护更方便，也好重用
      login(this.user).then(res => {
        // console.log(res)
        // 登陆成功
        this.$notify({
          message: '登陆成功',
          type: 'success'
        })

        // 关闭loading
        this.loginLoading = false

        // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
        // 本地存储只能存字符串
        // 如果需要存储对象、数组类型的数据，则把他们转换为 JSON 格式字符串存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        this.$notify.error({
          title: '错误',
          message: '登录失败,手机号或验证码错误',
          duration: 2000
        })

        // 关闭loading
        this.loginLoading = false
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
