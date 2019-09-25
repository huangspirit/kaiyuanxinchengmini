// pages/orderGoods/orderGoods.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    spotList: [],
    siderIndex: 0
  },
  getclassList() {
    api.get('/api-g/gods-anon/queryDirectC', {
      goods_type: false,
      start: 0,
      length: 10
    }).then((res) => {
      console.log(res)
      this.setData({
        classList: res.data.list
      })
    })
  },
  siderChange(val) {
    console.log(val)
    var index = 0
    if (val) {
      console.log('1111')
      this.setData({
        siderIndex: val.currentTarget.dataset.index + 1
      })
      index = val.currentTarget.dataset.index + 1
    }
    if (index == 0) {
      this.getclassList()
    } else {
      api.get('/api-g/gods-anon/queryDirectC', {
        goods_type: false,
        start: 0,
        length: 10,
        status: 1,
        catergory_id: val.currentTarget.dataset.item.id
      }).then((res) => {
        console.log(res)
        this.setData({
          classList: res.data.list
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getclassList()

    api.get('/api-g/gods-anon/queryDirectGoods', {
      start: 0,
      length: 10,
      goods_type: false,
      status: 1
    }).then((res) => {
      console.log(res)
      this.setData({
        spotList: res.data.data
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