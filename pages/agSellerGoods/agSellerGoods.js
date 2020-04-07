// pages/agSellerGoods/agSellerGoods.js
import api from '../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopNav:false,
    navH: 0,
    baseURL3: app.globalData.baseURL3,
    errorImg: app.globalData.errorImg,
    goodslist:[],
    currentPage:1,
    pageSize:10,
    params:{},
    total:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      navH: app.globalData.navHeight,
      params:options
    })
    this.getgoodslist()
  },
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  toHome() {
    this.setData({
      showTopNav:!this.data.showTopNav
    })
  },
  getgoodslist(isnotFirst) {
    wx.showLoading({
      title: '加载中...',
    })
    api.get('/api-g/gods-anon/queryDirectGoods', {
      start: (this.data.currentPage-1)*this.data.pageSize,
      length: this.data.pageSize,
      //show_brand: 1,
      ...this.data.params
    }).then(res => {
      wx.hideLoading()
      this.setData({
        total: res.data.total,
      })
      if(isnotFirst){
          this.setData({
            goodslist: this.data.goodslist.concat(res.data.data.map(item => {
              if (item.sellerGoodsImageUrl) {
                item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
              }
              return item;
            }))
          })
      }else{
        this.setData({
          goodslist: res.data.data.map(item => {
            if (item.sellerGoodsImageUrl) {
              item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
            }
            return item;
          })
        })
      }
    })
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
      if(this.data.total>this.data.goodslist.length){
        this.setData({
          currentPage:this.data.currentPage+1
        })
        this.getgoodslist(true)
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})