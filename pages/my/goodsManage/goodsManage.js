// pages/my/googsManage/goodsManage.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    xiajiaList: [],
    saleList: []
  },
  //swiper切换时会调用
  pagechange: function(e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
      console.log('66666', this.data.currentIndex)
    }
  },
  //用户点击tab时调用
  titleClick: function(e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
    console.log(this.data.currentIndex)
  },
  getSaleList() {
    api.get("/api-g/goods-b/queryPublishGoodsListByUser", {
      start: 0,
      length: 10,
      isenable: true,
      searchType: true,
    }).then(res => {
      console.log('在售', res)
      this.setData({
        saleList: res.data.data
      })
    })
  },
  getXiajiaList(val) {
    api.get("/api-g/goods-b/queryPublishGoodsListByUser", {
      start: 0,
      length: 10,
      isenable: false,
      searchType: true,
    }).then(res => {
      console.log('已下架', res)
      this.setData({
        xiajiaList: res.data.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSaleList()
    this.getXiajiaList()
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