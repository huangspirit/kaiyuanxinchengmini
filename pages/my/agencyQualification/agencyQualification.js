// pages/my/agencyQualification/agencyQualification.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agentList: []
  },
  getAgentList() {
    api.get('/api-b/customerCenter/getQualificationList', {
      start: 0,
      length: 1000
    }).then((res) => {
      console.log(res)
      this.setData({
        agentList: res.data.data
      })
    })
  },
  agentDetail(val) {
    console.log(val)
    let params = val.currentTarget.dataset.item
    params = JSON.stringify(params)
    wx.navigateTo({
      url: './agencyDetail/agencyDetail?params=' + params,
    })
  },
  addAgency() {
    wx.navigateTo({
      url: './addEditAgency/addEditAgency',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAgentList()
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