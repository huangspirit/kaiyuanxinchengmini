// pages/my/components/my/my.js
import api from '../../../../api/api.js'
Component({
  options: {
    // multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      this.getUsrInfo()
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      
    },
    hide: function () { },
    resize: function () { },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderList: [{
        img: '../../../../img/my/daiqueren.png',
        name: "待确认"
      },
      {
        img: '../../../../img/my/daifukuan.png',
        name: "待付款"
      },
      {
        img: '../../../../img/my/daishouhuo.png',
        name: "待收货"
      },
      {
        img: '../../../../img/my/shouhou.png',
        name: "售后/异常"
      },
    ],
    orderList1: [{
        img: '../../../../img/my/daipifu.png',
        name: "待批复"
      },
      {
        img: '../../../../img/my/yipifu.png',
        name: "已批复"
      },
      {
        img: '../../../../img/my/yixiadan.png',
        name: "已下单"
      },
      {
        img: '../../../../img/my/yishixiao.png',
        name: "已失效"
      },
    ],
    userInfoDetail: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    myInquiry(val) {
      console.log(val)
      let index = val.currentTarget.dataset.index
      console.log(index)
      wx.navigateTo({
        url: './myInquiry/myInquiry?params=' + index,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    myOrder(val) {
      let index = val.currentTarget.dataset.index
      console.log(index)
      wx.navigateTo({
        url: './myOrder/myOrder?params=' + index,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    myFocus(val) {
      let index = val.currentTarget.dataset.index
      console.log(index)
      wx.navigateTo({
        url: './myFocus/myFocus?params=' + index,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    getUsrInfo() {
      api.get("/api-u/users-anon/queryCustomerCenterSummary", {}).then(res => {
        console.log('个人信息', res)
        this.setData({
          userInfoDetail: res.data
        })
      })
    },
  }
})