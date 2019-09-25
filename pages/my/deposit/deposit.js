// pages/my/deposit/deposit.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    depositList: [],
    numIndex: 0
  },
  getdepoistList() {
    api.get('/api-b/customerCenter/getDepositList', {
      start: 0,
      length: 10,
      is_enable: true
    }).then((res) => {
      console.log(res)
      this.setData({
        depositList: res.data.data
      })
    })
  },
  amountChange(val) {
    let index = val.currentTarget.dataset.index
    this.setData({
      numIndex: index
    })
  },
  topupDetail() {
    wx.navigateTo({
      url: './depositDetail/depositDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getdepoistList()
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