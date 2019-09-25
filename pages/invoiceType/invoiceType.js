// pages/invoiceType/invoiceType.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceList: [],
    invoiceDetail: [],
    defaultInvoice: {},
    OrderInformation: {},
    payStorage: {}
  },
  getInvoiceList() {
    api.get('/api-g/goods-b/queryGoodsBillSetOffList', {
      isenable: true,
      start: 0,
      length: 100
    }).then(res => {
      console.log(res)
      for (let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].checked = false
      }
      let length = res.data.data.length - 1
      res.data.data[length].checked = true
      this.setData({
        invoiceList: res.data.data
      })
    })
  },
  getinvoiceDetail() {
    api.get('/api-u/userBill/queryUserBill?', {
      start: 0,
      length: 100
    }).then(res => {
      console.log(res)
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i]['checked'] = false
      }

      if (res.data.total == 1) {
        this.data.defaultInvoice = res.data.data[0]
        res.data.data[0].checked = true
      } else if (res.data.total > 1) {
        let count = 0;
        res.data.data.forEach(item => {
          if (item.isdefault) {
            count++
          }
        })
        this.data.defaultInvoice = res.data.data[count]
        res.data.data[count].checked = true
      };
      this.setData({
        invoiceDetail: res.data.data,
        defaultInvoice: this.data.defaultInvoice
      })
      console.log(this.data.defaultInvoice)
    })
  },
  invoiceChange(val) {
    console.log(val)
    let index = val.currentTarget.dataset.index
    for (let i = 0; i < this.data.invoiceList.length; i++) {
      this.data.invoiceList[i].checked = false
    }
    this.data.invoiceList[index].checked = true
    let bill = JSON.parse(this.data.OrderInformation.bill);
    bill.billtype = this.data.invoiceList[index].id;
    this.data.OrderInformation.bill = JSON.stringify(bill)
    this.data.payStorage.obj2 = this.data.OrderInformation
    this.setData({
      invoiceList: this.data.invoiceList,
      OrderInformation: this.data.OrderInformation
    })
  },
  chooseInvoice(val) {
    console.log(val)
    let index = val.currentTarget.dataset.index
    for (let i = 0; i < this.data.invoiceDetail.length; i++) {
      this.data.invoiceDetail[i].checked = false
    }
    this.data.invoiceDetail[index].checked = true
    let bill = JSON.parse(this.data.OrderInformation.bill);
    bill.content_id = this.data.invoiceDetail[index].id;

    this.data.OrderInformation.bill = JSON.stringify(bill)
    this.data.payStorage.obj2 = this.data.OrderInformation
    this.setData({
      invoiceDetail: this.data.invoiceDetail,
      OrderInformation: this.data.OrderInformation
    })
  },
  addInvoice() {
    wx.navigateTo({
      url: '../addInvoice/addInvoice',
    })
  },
  confirm() {
    console.log(this.data.OrderInformation, this.data.payStorage)
    this.data.payStorage.data = JSON.stringify(this.data.payStorage.data)
    this.data.payStorage.obj2 = JSON.stringify(this.data.payStorage.obj2)
    this.data.payStorage = JSON.stringify(this.data.payStorage)
    wx.setStorage({
      key: 'buyOneGoodsDetail',
      data: this.data.payStorage
    })
    wx.navigateTo({
      url: '../pay/pay',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInvoiceList()
    this.getinvoiceDetail()
    this.data.payStorage = JSON.parse(wx.getStorageSync('buyOneGoodsDetail'))
    this.data.payStorage.data = JSON.parse(this.data.payStorage.data)
    this.data.payStorage.obj2 = JSON.parse(this.data.payStorage.obj2)
    console.log(this.data.payStorage)
    this.data.OrderInformation = this.data.payStorage.obj2
    this.setData({
      OrderInformation: this.data.OrderInformation,
      payStorage: this.data.payStorage
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