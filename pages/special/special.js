// pages/special/special.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specialSider:[
      {
        name:'最新发布',
        id:'0'
      }, {
        name: '即将结束',
        id: '1'
      }, {
        name: '现货',
        id: '2'
      }, {
        name: '订货',
        id: '3'
      }, {
        name: '呆料',
        id: '4'
      },
    ],
    siderIndex:0
  },
  siderChange(val) {
    console.log(val)
    this.setData({
      siderIndex: val.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
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