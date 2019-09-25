// pages/my/walletDetail/saleDetail/saleDetail.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleList: []
  },
  getSalelist() {
    api.get('/api-u/users/queryUserConsumeDetailList', {
      type: 3,
      length: 100,
      start: 0
    }).then((res) => {
      if (res.data != null) {
        this.setData({
          saleList: res.data.data
        })
      }
    })
  },
  toDetail(val) {
    console.log(val)
    let params = JSON.stringify(val.currentTarget.dataset.item) 
    wx.navigateTo({
      url: '../saleDesc/saleDesc?params=' + params,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSalelist()
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