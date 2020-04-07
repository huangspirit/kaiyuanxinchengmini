// pages/center/buyer/oneOrderDetail/oneOrderDetail.js
import api from '../../../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopNav:false,
    navH: app.globalData.navHeight,
    host: app.globalData.host,
    tablist: [{
      name: '全部',
      id: -1,
    }, {
        name: '未开票',
        id: 0,
      }, {
        name: '已开票',
        id: 1,
      }, ],
    billStates:-1
  },
  tabSelect(e){
    this.setData({
      billStates:e.currentTarget.dataset.id
    })
  },
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  toHome() {
    this.setData({
      showTopNav:!this.data.showTopNav
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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