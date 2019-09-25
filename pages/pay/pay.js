// pages/pay/pay.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    defaultAddress: "",
    allAddress: [],
    invoiceList: [],
    payDetail: {},
    OrderInformation: {},
    UScount: 0,
    unuscount: 0,
    invoiceText: "",
    payStorage: {},
    timer: "",
    loadModal:false
  },
  getInvoiceList() {
    api.get('/api-g/goods-b/queryGoodsBillSetOffList', {
      isenable: true,
      start: 0,
      length: 100
    }).then(res => {
      console.log('发票列表', res)
      for (let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].checked = false
      }
      let length = res.data.data.length - 1
      res.data.data[length].checked = true
      this.setData({
        invoiceList: res.data.data
      })

      let bill = JSON.parse(this.data.OrderInformation.bill)
      console.log(this.data.invoiceList, bill)
      for (let i = 0; i < this.data.invoiceList.length; i++) {

        if (this.data.invoiceList[i].id == bill.billtype) {
          this.setData({
            invoiceText: this.data.invoiceList[i].name
          })
        }
      }
    })
  },
  invoiceInfo() {
    wx.navigateTo({
      url: '../invoiceType/invoiceType',
    })
  },
  changeAddress() {
    wx.navigateTo({
      url: './adress/adress',
    })
  },
  payMoney() {
    console.log(this.data.OrderInformation)
    this.setData({
      loadModal: true
    })
    this.data.OrderInformation.type = "1";
    api.post('/api-g/goods-b/orderCreater', this.data.OrderInformation).then((res) => {
      console.log(res)
      if (res.resultCode == '200') {
        this.getorderInfo(res)
      }
    })
  },
  getorderInfo(res) {
    let token = wx.getStorageSync('token')
    var value = res
    console.log(value)
    api.get('/api-order/customerCenter/queryOrderInfo', {
      orderNo: res.data,
      access_token: token
    }).then((response) => {
      console.log(response)
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
                  url: '../my/sellerOrder/sellerOrder',
                })

              },
              'fail': function(res) {
                console.log(res)
                wx.navigateTo({
                  url: '../my/sellerOrder/sellerOrder',
                })
              },
              'complete': function(res) {
                console.log(res)
                wx.navigateTo({
                  url: '../my/sellerOrder/sellerOrder',
                })
              }
            })
          }
        })
        return
      }
    }).catch((err) => {
      var that = this
      this.data.timer = setTimeout(() => {
        console.log('33333333', value)
        that.getorderInfo(value)
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInvoiceList()
    this.data.payStorage = JSON.parse(wx.getStorageSync('buyOneGoodsDetail'))
    this.data.defaultAddress = JSON.parse(wx.getStorageSync('chooseAddress'))
    this.data.payStorage.data = JSON.parse(this.data.payStorage.data)
    this.data.payStorage.obj2 = JSON.parse(this.data.payStorage.obj2)
    console.log(this.data.payStorage)
    this.data.listData = this.data.payStorage.data.data.deatil
    this.data.payDetail = this.data.payStorage.data.data
    this.data.OrderInformation = this.data.payStorage.obj2

    console.log(this.data.payStorage, this.data.listData)
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
      console.log(key)

      data.push({
        name: key,
        list: this.data.listData[key]
      });
    }
    console.log(data)
    this.setData({
      listData: data,
      payDetail: this.data.payDetail,
      unuscount: this.data.unuscount,
      UScount: this.data.UScount,
      OrderInformation: this.data.OrderInformation,
      defaultAddress: this.data.defaultAddress
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