<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div style="padding-bottom:20px;">
        <el-radio-group v-model="radio1" size='small'>
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="收藏"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col :lg="4" :xs="12" :sm="6" :md="6"
        v-for="(img,index) in images" :key="index"
        >
          <el-image
          style="height: 100px"
          :src="img.url"
          fit="cover"></el-image>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getImages } from '@/api/img'

export default {
  name: 'imageIndex',
  components: {},
  props: {},
  data () {
    return {
      radio1: '全部',
      images: [] // 图片素材列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  mounted () {},
  methods: {
    loadImages () {
      getImages().then(res => {
        this.images = res.data.data.results
      })
    }
  }
}
</script>

<style lang="less">

</style>
