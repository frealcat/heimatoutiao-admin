<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group
        @change="loadImages(1)"
        v-model="collect"
        size='small'>
          <el-radio-button
          :label="false">全部</el-radio-button>
          <el-radio-button
          label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
        @click="dialogUploadVisible = true"
        size="small" type="success">上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col
        class="image-item"
        :lg="4" :xs="12" :sm="6" :md="6"
        v-for="(img,index) in images" :key="index"
        >
          <el-image
          style="height: 100px"
          :src="img.url"
          fit="cover"></el-image>
          <div class="image-action">
            <el-button
            size="mini"
            type="warning"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            @click="onCollect(img)"
            :loading="img.loading"
            ></el-button>
            <el-button
            size="mini"
            icon="el-icon-delete-solid"
            circle
            type="danger"
            :loading="img.loading"
            @click="onDelete(img)"
            ></el-button>
            <!-- <i
            :class="{
              'el-icon-star-on': img.is_collected,
              'el-icon-star-off': !img.is_collected,
            }"
            @click="onCollect(img)"
            ></i> -->
            <!-- <i class="el-icon-delete-solid"></i> -->
          </div>
        </el-col>
      </el-row>

      <!-- 数据分页 -->
      <!--
        分页数据改变以后，页码不会变化
        它需要单独处理高亮的页面
       -->
      <el-pagination
        @current-change="onPageChange"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        >
      </el-pagination>
    </el-card>

    <el-dialog
    :append-to-body="true"
    title="上传素材"
    :visible.sync="dialogUploadVisible">
    <!--
      upload 组件本身就支持请求提交上传操作，意思就是你自己不去发请求，他自己机会去发
      请求方法：默认就是POST
      请求路径：action，必须写完整路径
      请求头：headers
     -->
        <el-upload
          class="upload-demo"
          drag
          action="http://api-toutiao-web.itheima.net/mp/v1_0//user/images"
          multiple
          name="image"
          :headers="uploadHeaders"
          :on-success="onUploadSuccess"
          :show-file-list="false"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/img'

export default {
  name: 'imageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总数据条数
      pageSize: 18, // 每页数据条数
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    // 页面初始化，加载第一页数据
    this.loadImages()
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码，防止数据与页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page: page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img 对象本来没有loading这个属性，我们拿到数据后手动添加
          // 然后用来控制每个收藏按钮的 loading状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新列表
      this.loadImages(this.page)

      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      // if (img.is_collected) {
      //   // 已收藏，取消收藏
      //   collectImage(img.id, false)
      // } else {
      //   // 没有收藏，添加收藏
      //    collectImage(img.id, true)
      // }
      // 展示 loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
    },
    onDelete (img) {
      img.loading = true
      // 调用删除方法
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        this.$message({
          type: 'success',
          message: '删除图片成功',
          duration: 1500
        })
        img.loading = false
      })
    }
  }
}
</script>

<style lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.image-item {
  position: relative;
}

.image-action {
  height: 30px;
  background-color: rgba(204, 204, 204, .5);
  position: absolute;
  bottom: 3px;
  left: 5px;
  right: 5px;
  font-size: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: rgb(255, 255, 255);
}
</style>
