// pages/my/myOrder/components/alredyEnd/alredyEnd.js
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
    endOrder: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAlredyOrder() {
      api.get("/api-order/customerCenter/queryOrderPersonal", {
        start: 0,
        length: 10,
        type: 5
      }).then(res => {
        console.log('已完成订单', res)
        if (res.resultCode == "200") {
          this.setData({
            endOrder: res.data.data
          })
        }
      })
    }
  }
})