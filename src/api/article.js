/*
  文章相关请求模块
*/

import request from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body 使用 data 设置
    // query 参数使用 params 设置
    // Headers 参数使用 headers 设置
    params
  })
}

// 获取文章频道
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中写的路径参数需要在url中传递
    // 凡是看见接口路径中有 ：xxx 格式的字段，则需要传递参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}
