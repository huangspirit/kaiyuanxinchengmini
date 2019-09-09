// pages/my/myInquiry/components/waitDetail/waitDetail.js
import getFormat from '../../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyDetail: {},
    effectEndTime: "",
    countDown: ""
  },
  /**
   * 格式化时间
   */

  setCountDown: function() {
    let time = 1000
    if (this.data.effectEndTime <= 0) {
      this.data.effectEndTime = 0;
    }
    let formatTime = getFormat.getFormat(this.data.effectEndTime);
    this.data.effectEndTime -= time;
    this.data.countDown = `${formatTime.day}天${formatTime.hh}时${formatTime.mm}分${formatTime.ss}秒`;
    this.setData({
      countDown: this.data.countDown
    })
    setTimeout(this.setCountDown, time);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = JSON.parse(wx.getStorageSync('appllyDetail'))

    this.setData({
      applyDetail: data,
      effectEndTime: data.effectEndTime - data.currentTime
    })
    this.setCountDown()
    console.log(this.data.applyDetail)
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