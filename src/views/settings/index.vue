<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <el-col :span="14">
          <el-form
          ref="userForm"
          :model="user"
          label-width="70px"
          :rules="userForm"
          >
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop='email'>
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
              type="primary"
              @click="onUpdateUser"
              :loading="updateProfileLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="4" :span="4">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar
            shape="square"
            :size="150"
            fit="cover"
            :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
            </label>
          <input
          id="file"
          type="file"
          ref="file"
          hidden
          @change="onFileChange"
          >
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
      >
      <div class="preview-image-wrap">
        <img
          id="preview-image"
          class="preview-image"
          :src="previewImage"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
        type="primary"
        @click="onUpdatePhoto"
        :loading="updatePhotoLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { globalBus } from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: { // 用户资料
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      copper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新用户头像loading状态
      updateProfileLoading: false, // 更新用户信息按钮loading
      userForm: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { min: 5, max: 140, message: '媒体介绍长度在 5 到 140 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      // 表单验证
      this.$refs.userForm.validate(valid => {
        if (!valid) {
          return
        }
        // 验证通过,提交表单
        // 开启loading状态
        this.updateProfileLoading = true
        const { name, intro, email } = this.user
        updateUserProfile({
          name,
          intro,
          email
        }).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          // 关闭loading状态
          this.updateProfileLoading = false

          // 发布通知，用户信息已修改
          globalBus.$emit('update-user', this.user)
        })
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      // 将图片src交给预览
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true
      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 图片裁切器必须基于 img 进行初始化
      // 注意： img 必须是可见状态才能正常完成初始化
      //      因为我们要在对话框里面初始化裁切器
      //      所以务必要在对话框完全打开的状态下初始化
      // 获取dom 节点
      const image = document.getElementById('preview-image')
      // 第一次初始化后，如果预览裁切的图片发生了变化，裁切器默认不会更新
      // 有两种方法更新：
      //   1.裁切器 .replace 方法
      //   2.销毁裁切器，重新初始化
      // 初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      const cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxMovable: true,
        cropBoxResizable: false,
        background: false
        // 当你移动裁切器时，会触发 crop 方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
      this.cropper = cropper
    },
    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 让确定按钮开始loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('', file)
        // 请求更新用户对象 请求提交fd
        updateUserPhoto(fd).then(res => {
          // console.log(res)
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示

          // 直接把裁切结果的文件对象转为 blob 对象预览
          this.user.photo = window.URL.createObjectURL(file)

          // 关闭确定按钮的loading
          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '头像更新成功'
          })
          globalBus.$emit('update-user', this.user)
          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
        })
      })
    }
  }
}
</script>

<style lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
