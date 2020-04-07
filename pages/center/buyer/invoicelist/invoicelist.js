// pages/center/buyer/oneOrderDetail/oneOrderDetail.js
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
    UserBilllist:[],
    currentPage:1,
    pageSize:10,
    total:0
  },
  getlist(){
    api.get("/api-u/userBill/queryUserBill",{
      start:(this.data.currentPage-1)*this.data.pageSize,
      length:this.data.pageSize
    }).then(res=>{
      if(this.data.currentPage==1){
        this.setData({
          UserBilllist: res.data.data,
          total:res.data.total
        })
      }else{
        this.setData({
          UserBilllist: this.data.UserBilllist.concat(res.data.data)
        })
      }
        
    })
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
      if(this.data.total>this.data.UserBilllist.length ){
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