/*
  全局通信总线
  呼叫中心
  作用：可以让任何组件之间相互通信
*/
import Vue from 'vue'

export const globalBus = new Vue()

// 假设 a 组件要给 b 组件发送数据

// b 要注册通信的事件
// import globalBus from '@/ytils/global-bus'
// globalBus.$emit('自定义事件名称', () => {'事件处理'})

// a 发布通信事件
// import globalBus from '@/ytils/global-bus'
// globalBus.$emit('自定义事件名称', option)
// 注意：通信两端所使用的事件名称必须一直，否则是无效的
