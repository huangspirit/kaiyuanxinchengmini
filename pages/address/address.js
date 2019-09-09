// pages/address/address.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },
  getAdressList() {
    api.get('/api-u/address/queryAllReceivingAddress', {
      start: 0,
      length: 10
    }).then(res => {
      console.log('收货地址', res)
      if (res.resultCode == '200') {
        this.setData({
          addressList: res.data.data
        })
        wx.stopPullDownRefresh();
      }

    })
  },
  addNewAdress() {
    wx.setStorageSync('editAdress', '')
    wx.navigateTo({
      url: '../editAdress/editAdress',
    })
  },
  btnEdit(val) {
    console.log(val)
    let adressDetail = JSON.stringify(val.currentTarget.dataset.item) 
    wx.setStorageSync('editAdress', adressDetail)
    wx.navigateTo({
      url: '../editAdress/editAdress',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAdressList()
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
    this.getAdressList()
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