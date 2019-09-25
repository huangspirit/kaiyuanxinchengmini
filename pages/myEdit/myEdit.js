// pages/myEdit/myEdit.js
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userDetail: {}
  },
  addressEdit() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  getUsreInfo() {
    api.get("/api-u/users/current", {}).then(res => {
      console.log('个人信息', res)
      this.setData({
        userDetail: res
      })
    })
  },
  personalInfo() {
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },
  accountChange() {
    // wx.navigateTo({
    //   url: '../accountManage/accountManage',
    // })
    wx.showActionSheet({
      itemList: ['我是卖家', '我是买家'], //显示的列表项
      success: function(res) { //res.tapIndex点击的列表项
        console.log("点击了列表项：", res)
        if (res.tapIndex == 0) {
          wx.setStorageSync('isBuyer', false)
        } else if (res.tapIndex == 1) {
          wx.setStorageSync('isBuyer', true)
        }
        wx.switchTab({
          url: '../my/my',
        })
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  editPhone() {
    wx.navigateTo({
      url: './editPhone/editPhone',
    })
  },
  loginOut() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('refreshToken')
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUsreInfo()
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