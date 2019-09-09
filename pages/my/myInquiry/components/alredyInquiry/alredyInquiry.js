// pages/my/myInquiry/components/alredyInquiry/alredyInquiry.js
import api from '../../../../../api/api.js'
import getFormat from '../../../../../utils/util.js'
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
    alredyInquiryList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAlredyInquiry() {
      api.get("/api-g/ic/queryInquirySheetList", {
        start: 0,
        length: 6,
        type: false,
        reply_status: true
      }).then(res => {
        console.log('已批复', res)
        if (res.resultCode == "200") {
          this.setData({
            alredyInquiryList: res.data.data
          })
        }
      })
    },
    alredyInquiryDetail(val) {
      console.log(val)
      let alredyInquiryLocal = JSON.stringify(val.currentTarget.dataset.item)
      wx.setStorageSync('appllyDetail', alredyInquiryLocal)
      wx.navigateTo({
        url: '../myInquiry/components/alredyInquiryDetail/alredyInquiryDetail',
      })
    }
  }
})