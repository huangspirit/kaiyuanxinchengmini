// pages/pay/pay.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notshowDetail:true,
    navH:0,
    errorImg: app.globalData.errorImg,
    listData: [],
    payDetail: {},
    OrderInformation: {},
    UScount: 0,
    unuscount: 0,
    payStorage: {},
    timer: "",
    loadModal:false,
    adressList: [],
    invoiceList: [],
    invoiceDetailList: [],
    addressindex: 0,
    defaultInvoiceIndex:0,
    defaultInvoiceDetailIndex:0,
    isback:false,
    adressIsBack:false
  },
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  toHome() {
    wx: wx.switchTab({
      url: '../home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  setshowdetail(){
    this.setData({
      notshowDetail:!this.data.notshowDetail
    })
  },
  getAdress() {
    api.get("/api-u/address/queryAllReceivingAddress", {
      start: 0,
      length: 100
    }).then(res => {
      if (res.data != null) {
        if (this.data.adressIsBack){
          this.setData({
            adressList:res.data.data,
          })
        }else{
        let index0=0
        let list = res.data.data.map((item,index)=>{
          if(item.isdefault){
            index0=index
          }
          return item;
        })
        this.setData({
          adressList: list,
          addressindex:index0
        })
      }
      } else {
        this.setData({
          adressList: []
        })
      }
    })
  },
  getInvoiceList() {
    api.get('/api-g/goods-b/queryGoodsBillSetOffList', {
      isenable: true,
      start: 0,
      length: 100
    }).then(res => {
      this.setData({
        invoiceList: res.data.data,
      })
      // let bill = JSON.parse(this.data.OrderInformation.bill)
      // for (let i = 0; i < this.data.invoiceList.length; i++) {
      //   if (this.data.invoiceList[i].id == bill.billtype) {
      //     this.setData({
      //       invoiceText: this.data.invoiceList[i].name
      //     })
      //   }
      // }
    })
  },
  getinvoiceDetail() {
    api.get('/api-u/userBill/queryUserBill?', {
      start: 0,
      length: 100
    }).then(res => {
      if(this.data.isback){
        this.setData({
          invoiceDetailList: res.data.data,
        })
      }else{
        let defaultInvoiceDetailIndex = 0
        let list = res.data.data.map((item, index) => {
          if (item.isdefault) {
            defaultInvoiceDetailIndex = index
          }
          return item;
        })
        this.setData({
          invoiceDetailList: list,
          defaultInvoiceDetailIndex: defaultInvoiceDetailIndex
        })
      }
      
    })
  },
  invoiceInfo() {
    wx.navigateTo({
      url: '../invoiceType/invoiceType?defaultInvoiceDetailIndex=' + this.data.defaultInvoiceDetailIndex + "&defaultInvoiceIndex=" + this.data.defaultInvoiceIndex,
    })
  },
  changeAddress() {
    wx.navigateTo({
      url: '/pages/center/buyer/addressList/addressList?addressindex=' + this.data.addressindex,
    })
  },
  payMoney() {
    this.setData({
      loadModal: true
    })
    this.data.OrderInformation.payWay = false;
    this.data.OrderInformation.type = "1";
    this.data.OrderInformation.add_id = this.data.adressList[this.data.addressindex].id;
    this.data.OrderInformation.bill=JSON.stringify({
      billtype : this.data.invoiceList[this.data.defaultInvoiceIndex].id,
      content_id : this.data.invoiceDetailList[this.data.defaultInvoiceDetailIndex].id
    })
    api.get("/api-g/gods-b/getToken").then(res=>{
      api.post('/api-g/goods-b/orderCreater', this.data.OrderInformation, { token: res.data }).then((res) => {
        if (res.resultCode == '200') {
          this.getorderInfo(res)
        }
      })
    })
   
  },
  getorderInfo(res) {
    var value = res
    api.get('/api-order/customerCenter/queryOrderInfo', {
      orderNo: res.data,
    }).
    then((response) => {
      console.log("response:", response)
      if (response.resultCode == '200') {
        clearTimeout(this.data.timer)
        api.get('/api-order/wechat/getWechatSamrtPay', {
          type: response.data.payType,
          message_id: res.data
        }).then((respon) => {
          console.log(respon)
          if (respon.resultCode == '200') {
            this.setData({
              loadModal: false
            })
            wx.requestPayment({
              timeStamp: respon.data.timeStamp,
              nonceStr: respon.data.nonceStr,
              package: respon.data.package,
              signType: 'MD5',
              paySign: respon.data.paySign,
              'success': function(res) {
                console.log(res)
                wx.navigateTo({
                  url: '/pages/center/buyer/buyerOrder/buyerOrder',
                })

              },
              'fail': function(res) {
                console.log(res)
                wx.navigateTo({
                  url: '/pages/center/buyer/buyerOrder/buyerOrder',
                })
              },
              'complete': function(res) {
                wx.navigateTo({
                  url: '/pages/center/buyer/buyerOrder/buyerOrder',
                })
              }
            })
          }
        })
        return
      } else if (respon.resultCode == '400'){
        var that = this
        this.data.timer = setTimeout(() => {
          that.getorderInfo(value)
        }, 1000)
      }
    }).catch((err) => {
      var that = this
      this.data.timer = setTimeout(() => {
        that.getorderInfo(value)
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    this.getAdress();
    this.getInvoiceList();
    this.getinvoiceDetail();
    let obj = JSON.parse(wx.getStorageSync('buyOneGoodsDetail'))
    obj.data = JSON.parse(obj.data)
    obj.obj2 = JSON.parse(obj.obj2)
    this.data.listData = obj.data.data.deatil
    this.data.payDetail = obj.data.data
    this.data.OrderInformation = obj.obj2
    console.log(obj)
    var data = []
    for (let key in this.data.listData) {
      this.data.listData[key].forEach(item => {
        if (item.price_unit) {
          //  UScount+=Number(item.goods_count)
          this.data.UScount++;
        } else {
          //  unuscount+=Number(item.goods_count)
          this.data.unuscount++;
        }
      })
      data.push({
        name: key,
        list: this.data.listData[key]
      });
    }
    this.setData({
      listData: data,
      payDetail: this.data.payDetail,
      unuscount: this.data.unuscount,
      UScount: this.data.UScount,
      OrderInformation: this.data.OrderInformation,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAdress();
    this.getInvoiceList();
    this.getinvoiceDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearTimeout(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})