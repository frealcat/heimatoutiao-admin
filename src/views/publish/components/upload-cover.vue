<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img
        class="cover-img"
        ref="cover-image"
        :src='coverImage'
      >
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          素材库的内容</el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file"
          type="file"
          @change="onFileChange">
          <img ref="preview-image" width="100">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onCoverConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/img'

export default {
  name: 'UploadCover',
  components: {},
  props: ['cover-image'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'second'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },

    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
      // 防止用户选择同一个文件不触发事件
      // this.$refs.file.value = ''
    },

    onCoverConfirm () {
      // 如果 tab 是上传图片，并且input-file有选择的文件，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return () => {}
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传图片
          this.$refs['cover-image'].src = res.data.data.url
          // 将图片地址发送给父组件
          this.$emit('update-cover', res.data.data.url)
          this.$message({
            type: 'success',
            message: '图片上传成功',
            duration: 1500
          })
        })
      }
    }
  }
}
</script>

<style lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-img {
    height: 120px;
    max-width: 100%;
  }
}
</style>
