// pages/center/buyer/buyer.js
import api from '../../../api/api';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInforma: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    deliverNum:0,
    usd:0,
    rmb:0
  },
  attached: function () {
    console.log(this.properties.userInforma)
    this.getdeliverCarNum()
    this.querySellerCredit()
  },
  moved: function () { },
  detached: function () { },
  /**
   * 组件的方法列表
   */
  methods: {
    querySellerCredit() {
      api.get("/api-order/sellerCenter/querySellerCredit").then(res => {
        this.setData({
          rmb: res.data.rmb,
          usd: res.data.usd
        })
      })
    },
    getdeliverCarNum(){
      api.get("/api-order/sellerCenter/queryDeliverCarNumber").then(res=>{
        console.log(res)
        this.setData({
          deliverNum:res.data
        })
      })
    },
    toDetail(val){
      let modal = val.currentTarget.dataset.target;
      switch (modal) {
        case 'public':
          wx.navigateTo({
            url: '/pages/releaseSale/releaseSale',
          })
          return;
        case 'invoiceMange':
          wx.navigateTo({
            url: '/pages/center/buyer/invoiceManage/invoiceManage',
          })
          return;
        case "invoiceInformationManagement":
          wx.navigateTo({
            url: '/pages/center/buyer/invoicelist/invoicelist',
          })
          return;
        case "addressList":
          wx.navigateTo({
            url: "/pages/center/buyer/addressList/addressList",
          })
          return;
        case "feedBack":
          wx.navigateTo({
            url: "/pages/center/buyer/feedBack/feedBack",
          })
          return;
        case "afterMark":
          wx.navigateTo({
            url: "/pages/center/buyer/afterMark/afterMark",
          })
          return;
        case "applyDetail":
          wx.navigateTo({
            url: "/pages/center/buyer/applyDetail/applyDetail",
          })
          return;
      }
    }
  }
})
