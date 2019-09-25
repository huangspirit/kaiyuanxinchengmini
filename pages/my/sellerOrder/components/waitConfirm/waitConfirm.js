// pages/my/myOrder/components/waitConfirm/waitConfirm.js
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
    confirmOrder: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getwaitConfirmOrder() {
      api.get("/api-order/customerCenter/queryOrderPersonal", {
        start: 0,
        length: 10,
        type: 3
      }).then(res => {
        console.log('待确认订单', res)
        if (res.resultCode == "200") {
          this.setData({
            confirmOrder: res.data.data
          })
        }
      })
    }
  }
})