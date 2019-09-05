// pages/my/myInquiry/components/waitInquiry/waitInquiry.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWaitInquiry() {
      console.log('待批复')
    },
    waitDetail() {
      wx.navigateTo({
        url: '../myInquiry/components/waitDetail/waitDetail',
      })
    }
  }
})