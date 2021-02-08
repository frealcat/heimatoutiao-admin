<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
      ref="publish-form"
      :model="article"
      label-width="60px"
      :rules="formRules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
          placeholder="请输入文章内容"
          height="250px"
          lang="zh"
          v-model="article.content"
          :extensions="extensions"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!--
            我们需要把选择的封面图片的地址放到article.cover.image 数组中

            当你给事件处理函数传递了自定义参数以后，就无法得到原本的那个数据参数了

            如果想要在事件处理函数自定义参数以后还想得到原来事件本身的参数，则手动指定$event
           -->
           <!--
             当你给子组件提供的数据既要使用还要修改
              v-model="article.cover.images[index]"
              相当于下面两个语句简写，给子组件传递了一个名字叫value的数据
              :value="article.cover.images[index]"
              默认监听 input事件
              @input="article.cover.images[index]"

            注意：v-model 仅仅是简写了而已，本质还是父子组件通信
            -->
          <template v-if="article.cover.type > 0">
            <upload-cover
            v-for="(cover, index) in article.cover.type"
            :key="cover"
            v-model="article.cover.images[index]"
            />
            <!-- <upload-cover
            v-for="(cover, index) in article.cover.type"
            :key="index"
            :cover-image='article.cover.images[index]'
            @update-cover="onUpdateCover(index, $event)"
            /> -->
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
            :label="channel.name"
            :value="channel.id"
            v-for="(channel, index) in channels.channels"
            :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover'
import {
  getArticleChannels,
  addArticle,
  updateArticle,
  getArticle
} from '@/api/article'
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TextColor,
  ElementTiptap
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/img/'

export default {
  name: 'PublishInde',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      channels: [], // 文章怕频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 1, // 封面的类型
          // -1:自动，0：无图，1：单图，3：三图
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline(), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(), // 斜体
        new Image({
          // 默认会把图片生成base64字符串和内容存储在一起
          // 自定义图片上传
          uploadRequest (file) {
            // 如果接口要求 Content-Type 必须是 multipart/form-data
            // 则请求体必须使用 FromData
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new Strike(), // 删除线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TextColor()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()

    // 由于我们让发布和修改用的同一个组件，所以这里要判断
    // 如果路由路径参数中有id，则展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }
        // 验证通过，提交表单
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 如果是修改文章，则执行修改操作，否则执行添加操作
        const articleId = this.$route.query.id
        if (this.$route.query.id) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft)
            .then(res => {
              console.log(res)
              this.$message({
                message: `${draft ? '存入草稿' : '发布'}成功`,
                type: 'success'
              })
            })
        } else {
          addArticle(this.article, draft).then(res => {
            // 处理响应结果
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        }
      })
    },

    // 修改文章：加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },

    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style lang="less">

</style>
