// pages/pay/adress/adress.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresList: [],
    defaultAddressIndex: 0,
    routerIndex:-1,
    OrderInformation: {},
    payStorage: {}
  },
  addAdress() {
    wx.setStorageSync('editAdress', "");
    wx.navigateTo({
      url: '../editAdress/editAdress',
    })
  },
  editadress(val) {
    let item = this.data.addresList[val.currentTarget.dataset.index];
    wx.setStorageSync('editAdress', JSON.stringify(item));
    wx.navigateTo({
      url: '../editAdress/editAdress',
    })
  },
  getAdress() {
    api.get('/api-u/address/queryAllReceivingAddress', {
      start: 0,
      length: 100
    }).then(res => {
      if (res.data) {
        let index = 0;
        let list = res.data.data.map((item, index0) => {
          if (item.isdefault) {
            index = index0
          }
          return item;
        })
        this.setData({
          addresList: res.data.data,
          defaultAddressIndex: this.data.routerIndex > -1 ? this.data.routerIndex:index
        })
        // this.data.defaultAddress = JSON.parse(wx.getStorageSync('chooseAddress'))
        // for (var i = 0; i < res.data.data.length; i++) {
        //   res.data.data[i]['checked'] = false
        //   if (res.data.data[i].id == this.data.defaultAddress.id) {
        //     res.data.data[i]['checked'] = true
        //   }
        // }
        // this.setData({
        //   addresList: res.data.data,
        //   defaultAddress: this.data.defaultAddress
        // })
        // console.log('地址', this.data.addresList)
      }

    })
  },

  changeAdress(val) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      addressindex: val.currentTarget.dataset.index,
      adressIsBack:true
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      routerIndex: Number(options.addressindex)
    })
    // this.data.payStorage = JSON.parse(wx.getStorageSync('buyOneGoodsDetail'))
    // this.data.payStorage.obj2 = JSON.parse(this.data.payStorage.obj2)
    // console.log(this.data.payStorage)
    // this.data.OrderInformation = this.data.payStorage.obj2
    // this.setData({
    //   OrderInformation: this.data.OrderInformation
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAdress()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})