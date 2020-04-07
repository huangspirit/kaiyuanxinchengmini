// pages/center/buyer/focusSeller/focusSeller.js
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
    total:0,
    list:[],
    currentPage:1,
    pageSize:10
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
  godetail(val){
    
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?seller_goods_id='+val.currentTarget.dataset.sellergoodsid,
    })
  },
  getmore(val){
    wx.navigateTo({
      url: '/pages/agSellerGoods/agSellerGoods?seller_id=' + val.currentTarget.dataset.sellerid
    })
  },
  toShop(val){
  
    let item=val.currentTarget.dataset.target;
    if(item.user_tag==1){
      wx.navigateTo({
        url: '/pages/orSeller/orSeller?params= {"tag":"brand","id":'+item.seller_id+',"name":'+item.sellerName+'}',
      })
    }else{
      wx.navigateTo({
        url: '/pages/agSeller/agSeller?seller_id='+item.seller_id,
      })
    }
  },
  cancleFocus(val){
    wx.showLoading({
      title: '',
    })
    api.get("/api-g/gf/deleteGoodsFavourite",{
      id:val.currentTarget.dataset.target.id
    }).then(res=>{
      wx.hideLoading()
      this.setData({
        currentPage:1
      })
      this.getlist()
    })
  },
  getlist(){
    let obj = {
      start:(this.data.currentPage-1)*this.data.pageSize,
      length:this.data.pageSize,
      favour_type:2
    }
    api.get("/api-g/gf/queryGoodsFavouriteList",obj).then(res=>{
      if(this.data.currentPage==1){
          this.setData({
            total:res.data.list.total,
            list:res.data.list.data
          })
      }else{
        this.setData({
          list:this.data.list.concat(res.data.list.data)
        })
      }
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
      this.setData({
        currentPage:this.data.currentPage+1
      })
      this.getlist()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})