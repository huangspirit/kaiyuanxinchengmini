// pages/my/myInquiry/components/allInquiry/allInquiry.js
import api from '../../../../../api/api.js'
Component({
  options: {
    // multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    allInquiryList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAllInquiry() {
      api.get("/api-g/ic/queryInquirySheetList", {
        start: 0,
        length: 6,
        type: false
      }).then(res => {
        console.log('全部批复', res)
        if (res.resultCode == "200") {
          this.setData({
            allInquiryList: res.data.data
          })
        }
      })
    },
    allInquiryDetail(val) {
      let data = val.currentTarget.dataset.item
      let alredyInquiryLocal = JSON.stringify(val.currentTarget.dataset.item)
      wx.setStorageSync('appllyDetail', alredyInquiryLocal)
      if (data.sheetEffective == true && data.replayStates == false) {
        wx.navigateTo({
          url: '../myInquiry/components/waitDetail/waitDetail',
        })
      }
      if (data.sheetEffective == true && data.replayStates == true) {
        wx.navigateTo({
          url: '../myInquiry/components/alredyInquiryDetail/alredyInquiryDetail',
        })
      }
    }
  }
})