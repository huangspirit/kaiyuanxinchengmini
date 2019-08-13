// pages/search/search.js
const app = getApp()
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: []
  },
  search(val) {
    api.get('/api-g/gods-anon/searchIndex', {
      name: val.detail.value,
      start: 0,
      length: 10
    }).then(res => {
      this.setData({
        searchList: res.data.data
      })
    })
  },
  toDetail(val) {
    console.log(val, '555555')
    var tag = val.currentTarget.dataset['item']
    let obj = JSON.stringify(tag)
    if (tag.tag == 'brand') {
      wx: wx.navigateTo({
        url: '../brandDetail/brandDetail?brandList=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    else if (tag.tag == 'direct') {

    } else if (tag.tag == 'undirect') {

    } else if (tag.tag == 'goodsinfo') {

    }

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