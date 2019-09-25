// pages/pay/adress/adress.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresList: [],
    defaultAddress: {},
    OrderInformation: {},
    payStorage: {}
  },
  getAdress() {
    api.get('/api-u/address/queryAllReceivingAddress', {
      start: 0,
      length: 20
    }).then(res => {

      if (res.data) {
        this.data.defaultAddress = JSON.parse(wx.getStorageSync('chooseAddress'))
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i]['checked'] = false
          if (res.data.data[i].id == this.data.defaultAddress.id) {
            res.data.data[i]['checked'] = true
          }
        }
        this.setData({
          addresList: res.data.data,
          defaultAddress: this.data.defaultAddress
        })
        console.log('地址', this.data.addresList)
      }

    })
  },
  changeAdress(val) {
    console.log(val)
    let index = val.currentTarget.dataset.index
    for (var i = 0; i < this.data.addresList.length; i++) {
      this.data.addresList[i]['checked'] = false
    }
    this.data.addresList[index].checked = true
    this.setData({
      addresList: this.data.addresList
    })
    let address = JSON.stringify(this.data.addresList[index])
    this.data.OrderInformation.add_id = this.data.addresList[index].id
    console.log(this.data.OrderInformation)
    this.data.payStorage.obj2 = JSON.stringify(this.data.OrderInformation)
    
    let goodsDetail = JSON.stringify(this.data.payStorage)
    wx.setStorageSync('chooseAddress', address)
    wx.setStorageSync('buyOneGoodsDetail', goodsDetail)
    wx.navigateTo({
      url: '../pay',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAdress()
    this.data.payStorage = JSON.parse(wx.getStorageSync('buyOneGoodsDetail'))
    this.data.payStorage.obj2 = JSON.parse(this.data.payStorage.obj2)
    console.log(this.data.payStorage)
    this.data.OrderInformation = this.data.payStorage.obj2
    this.setData({
      OrderInformation: this.data.OrderInformation
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