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
    slowerlist: [],
    history: 0,
    month: 0,
    year: 0,
    customerCenterSummary: {},
    PriceNotisfyCount:0,
    modalName:null,
    password:"",
    oldpassword:"",
    newpassword:""
  },
  attached: function() {
    this.getslowerlist()
    this.queryCustomerCenterSummary();
    this.queryPriceNotisfyCount()
  },
  moved: function() {},
  detached: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    hideModal(){
      this.setData({
        modalName:null
      })
    },
    setPassword(){
      api.get("/api-b/draw/checkSetPassword").then(res=>{
        if(res.data){
          this.setData({
            modalName:"saveRePassword"
          })
        }else{
          this.setData({
            modalName:'savePassword'
          })
        }
      })
    },
    bindinput(val){
      this.setData({
        password:val.detail.value
      })
    },
    bindoldinput(val){
      this.setData({
        oldpassword:val.detail.value
      })
    },
    bindnewinput(val){
      this.setData({
        newpassword:val.detail.value
      })
    },
    confirmsave(){
      api.post("/api-b/draw/savedrawPassword",{password:this.data.password}).then(res=>{
        this.setData({
          modalName:null,
          password:""
        })
      })
    },
    confirmsetsave(){
      api.post("/api-b/draw/updatedrawPassword",{
        password:this.data.oldpassword,
        newpassword:this.data.newpassword
      }).then(res=>{
          this.setData({
            modalName:null,
            oldpassword:"",
            newpassword:""
          })
      })
    },
    toLowerPrice(){
      wx.navigateTo({
        url: "/pages/center/buyer/lowerPrice/lowerPrice",
      })
    },
    goOrderlist(val) {
      wx.navigateTo({
        url: "/pages/center/buyer/buyerOrder/buyerOrder?type=" + val.currentTarget.dataset.status,
      })
    },
    toDetail(val) {
      wx.navigateTo({
        url: '/pages/center/buyer/oneOrderDetail/oneOrderDetail?orderNo=' + val.currentTarget.dataset.orderno,
      })
    },
    getslowerlist() {
      api.get("/api-order/customerCenter/queryBuyCredit").then(res => {
        this.setData({
          slowerlist: res.data.slipContent,
          history: res.data.history,
          month: res.data.month,
          year: res.data.year
        })
      })
    },
    queryPriceNotisfyCount(){
      api.get("/api-g/goods-b/querryPriceNotisfyCount").then(res=>{
        this.setData({
          PriceNotisfyCount:res.data
        })
      })
    },
    queryCustomerCenterSummary() {
      api.get("/api-u/users-anon/queryCustomerCenterSummary").then(res => {
        this.setData({
          customerCenterSummary: res.data
        })
      })
    },
    toMangeDetail(val) {
      let modal = val.currentTarget.dataset.target;
      switch (modal) {
        case "focusSeller":
          wx.navigateTo({
            url: '/pages/center/buyer/focusSeller/focusSeller',
          })
          return;
        case "focusGoods":
          wx.navigateTo({
            url: '/pages/center/buyer/focusGoods/focusGoods',
          })
          return;
        case 'inquery':
          wx.navigateTo({
            url: '/pages/center/buyer/myInquiry/myInquiry',
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
            url: "/pages/center/buyer/address/address",
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