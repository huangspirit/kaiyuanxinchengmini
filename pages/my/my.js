// pages/my/my.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    tihuoWay: '我是买家',
    orderList: [{
        img: '../../img/my/daiqueren.png',
        name: "待确认"
      },
      {
        img: '../../img/my/daifukuan.png',
        name: "待付款"
      },
      {
        img: '../../img/my/daishouhuo.png',
        name: "待收货"
      },
      {
        img: '../../img/my/shouhou.png',
        name: "售后/异常"
      },
    ],
    orderList1: [{
        img: '../../img/my/daipifu.png',
        name: "待批复"
      },
      {
        img: '../../img/my/yipifu.png',
        name: "已批复"
      },
      {
        img: '../../img/my/yixiadan.png',
        name: "已下单"
      },
      {
        img: '../../img/my/yishixiao.png',
        name: "已失效"
      },
    ],
    userDetail:{}
  },

  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay: name,
      select: false
    })
  },
  myFocus(val) {
    let index = val.currentTarget.dataset.index
    console.log(index)
    wx.navigateTo({
      url: './myFocus/myFocus?params=' + index,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  myInquiry(val) {
    let index = val.currentTarget.dataset.index
    console.log(index)
    wx.navigateTo({
      url: './myInquiry/myInquiry?params=' + index,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  myOrder(val) {
    let index = val.currentTarget.dataset.index
    console.log(index)
    wx.navigateTo({
      url: './myOrder/myOrder?params=' + index,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  userInfo() {
    wx.navigateTo({
      url: '../myEdit/myEdit',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getUsrInfo() {
    api.get("/api-u/users/current", {}).then(res => {
      console.log('个人信息', res)
      this.setData({
        userDetail:res
      })
      // if (res.resultCode == "200") {
      //   this.setData({
      //     specialList: res.data.data
      //   })
      // }
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