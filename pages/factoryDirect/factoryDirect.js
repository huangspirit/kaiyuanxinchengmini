// pages/special/special.js
const app = getApp()
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyData: [],
    brandData: []
  },
  toIn() {
    wx.navigateTo({
      url: '../settle/settle',
    })
    return;
    wx.showToast({
      title: '请移步网站入驻',
      icon: "none"
    })
  },
  toDetail(val) {
    console.log(val)
    var tag = val.currentTarget.dataset['item']
    let obj = {}
    obj['id'] = tag.id
    obj['name'] = tag.brand
    obj['tag'] = tag.tag
    if (tag.tag == 'brand') {
      obj = JSON.stringify(obj)
      wx: wx.navigateTo({
        url: '../brandDetail/brandDetail?brandList=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (tag.tag == 'direct') {
      obj['brandId'] = ''
      obj = JSON.stringify(obj)
      wx: wx.navigateTo({
        url: '../direct/direct?params=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (tag.tag == 'undirect') {

    } else if (tag.tag == 'goodsinfo') {
      obj = JSON.stringify(obj)
      wx: wx.navigateTo({
        url: '../productDetail/productDetail?params=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取原厂直供
    api.get('/api-g/gods-anon/queryBrandHomePage', {}).then((res) => {
      console.log(res)
      this.data.brandData = res.data
      this.data.keyData = []
      for (var key in res.data) {
        console.log(key)
        this.data.keyData.push(key)
      }
      this.setData({
        brandData: this.data.brandData,
        keyData: this.data.keyData
      })
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