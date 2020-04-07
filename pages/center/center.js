// pages/center/center.js
import api from '../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbuyer: true,
    navH: 0,
    userInforma: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  setBuyer(val){
    console.log(val)
    if (val.currentTarget.dataset.k==1){
      this.setData({
        isbuyer:true
      })
    }else{
      this.setData({
        isbuyer: false
      })
    }
  },
  onLoad: function(options) {
    this.setData({
      navH: app.globalData.navHeight
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
    api.get('/api-u/users/current').then(res => {
      this.setData({
        userInforma: res
      })
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