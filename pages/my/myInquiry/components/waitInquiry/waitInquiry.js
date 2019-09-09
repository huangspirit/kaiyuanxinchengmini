// pages/my/myInquiry/components/waitInquiry/waitInquiry.js
import api from '../../../../../api/api.js'
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
    waitInquiryList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWaitInquiry() {
      api.get("/api-g/ic/queryInquirySheetList", {
        start: 0,
        length: 6,
        type: false,
        reply_status: false
      }).then(res => {
        console.log('待批复', res)
        if (res.resultCode == "200") {
          this.setData({
            waitInquiryList: res.data.data
          })
        }
      })
    },
    waitDetail(val) {
      let alredyInquiryLocal = JSON.stringify(val.currentTarget.dataset.item)
      wx.setStorageSync('appllyDetail', alredyInquiryLocal)
      wx.navigateTo({
        url: '../myInquiry/components/waitDetail/waitDetail',
      })
    }
  }
})