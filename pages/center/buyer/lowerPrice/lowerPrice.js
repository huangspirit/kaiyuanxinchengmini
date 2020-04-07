// pages/center/buyer/lowerPrice/lowerPrice.js
import api from '../../../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopNav:false,
    navH: app.globalData.navHeight,
    host: app.globalData.host,
    list:[],
    total:0,
    currentPage:1,
    pageSize:10,
    name:""
  },
  getlist(){
    api.get("/api-g/goods-b/queryPriceNotisfy",{
      start:(this.data.currentPage-1)*this.data.pageSize,
      length:this.data.pageSize,
      name:this.data.name
    }).then(res=>{
      if(this.data.currentPage==1){
        this.setData({
          total:res.data.total,
          list:res.data.data
        })
      }else{
        this.setData({
          list:this.data.list.concat(res.data.data)
        })
      }
    })
  },
  cancle(val){
    api.get("/api-g/gf/deleteGoodsFavourite",{id:val.currentTarget.dataset.goodsid}).then(res=>{
        this.setData({
          currentPage:1
        })
        this.getlist()
    })
  },
  del(val){
    api.get("/api-g/goods-b/deletePriceNotisfy",{id:val.currentTarget.dataset.id}).then(res=>{
      this.setData({
        currentPage:1
      })
      this.getlist()
  })
  },
  toDetail(val){
    api.get("/api-g/goods-b/updatePriceNotisfy",{id:val.currentTarget.dataset.item.id}).then(res=>{
      wx.navigateTo({
        url: '/pages/goodsDetail/goodsDetail?seller_goods_id='+val.currentTarget.dataset.item.seller_goods_id
      })
    })
    
  },
  toSearch(val){
    console.log(val.detail.value)
    this.setData({
      currentPage:1,
      name:val.detail.value
    })
    this.getlist()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getlist()
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
    if(this.data.total>this.data.list.length){
      this.getlist()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})