// pages/my/myOrder/components/abnormalOrder/abnormalOrder.js
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
    abnormalOrder:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getabnormalOrder() {
      api.get("/api-order/customerCenter/queryOrderPersonal", {
        start: 0,
        length: 10,
        type: 6
      }).then(res => {
        console.log('待付款订单', res)
        if (res.resultCode == "200") {
          this.setData({
            abnormalOrder: res.data.data
          })
        }
      })
    }
  }
})