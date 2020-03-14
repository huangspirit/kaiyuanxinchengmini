// pages/classCation/classCation.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNav: 1,
    calssIndex: 0,
    classList: [],
    subClassList: [],
    directObj: {},
    loadModal: false,
    errorImg:app.globalData.errorImg
  },
  getSubClassList(val) {
  
    if(val){
      this.setData({
        calssIndex: val.currentTarget.dataset.index
      })
    }
    this.setData({
      subClassList: this.data.classList[this.data.calssIndex].childernList,
      loadModal: false
    })
  },
  subClssRouter(val) {
    this.data.directObj = {}
  //  this.data.directObj['brandId'] = null
    this.data.directObj['tag'] = 'direct'
    this.data.directObj['name'] = val.currentTarget.dataset.item.name
    this.data.directObj['id'] = val.currentTarget.dataset.item.id
    this.setData({
      directObj: this.data.directObj
    })
    let directParams = JSON.stringify(this.data.directObj)
    wx: wx.navigateTo({
      url: '../direct/direct?params=' + directParams,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  toSearch() {
    wx: wx.switchTab({
      url: '../search/search',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // wx: wx.navigateTo({
    //   url: '../search/search',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
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
    // //获取分类列表
    this.setData({
      loadModal: true
    })
    api.get("/api-g/gods-anon/queryCatergoryHomePage", {
      catergory_id: 0,
      flag: true
    }).then(res => {
      if (res.resultCode == '200') {
        this.setData({
          classList: res.data,
          calssIndex: app.globalData.classType
        })
        this.getSubClassList()
       // this.getSubClassList(res.data[this.data.calssIndex])
      }
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