// pages/my/myInquiry/components/alredyAdov/alredyAdov.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAdvInquiry() {
      api.get("/api-g/ic/queryInquirySheetList", {
        start: 0,
        length: 6,
        type: false,
        sheet_effective: false
      }).then(res => {
        console.log('已失效', res)
        if (res.resultCode == "200") {
          if (res.data != null) {
            this.setData({
              advInquiryList: res.data.data
            })
          } else {
            this.setData({
              advInquiryList: []
            })
          }
        }
      })
    }
  }
})