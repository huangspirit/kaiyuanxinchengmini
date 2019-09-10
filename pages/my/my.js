// pages/my/my.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: "",
    tihuoWay: '我是买家',
    userDetail: {},
  },
  userInfo() {
    wx.navigateTo({
      url: '../myEdit/myEdit',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getUsrInfo() {
    api.get("/api-u/users/current", {}).then(res => {
      console.log('个人信息', res)
      this.setData({
        userDetail: res
      })
    })
  },
  editUser() {
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUsrInfo()

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
    this.data.select = wx.getStorageSync('isBuyer')
    this.setData({
      select: this.data.select
    })
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