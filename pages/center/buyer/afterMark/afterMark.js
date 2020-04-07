// pages/center/buyer/oneOrderDetail/oneOrderDetail.js
import api from '../../../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    host: app.globalData.host,
    showTopNav:false,
    currentPage:1,
    pageSize:10,
    list:[],
    total:0
  },
  getlist(){
    let obj = {
      start:(this.data.currentPage-1)*this.data.pageSize,
      length:this.data.pageSize
    }
    api.get("/api-b/feed/queryFeedList",obj).then(res=>{
        this.setData({
          list:res.data.map(item=>{
            console.log(item.url.indexOf('jpg') != -1)
            if(item.url.indexOf('png') != -1 || item.url.indexOf('jpg') != -1 || item.url.indexOf('jpeg') != -1){
              item.imgBtn=true
            }
            if(item.url.indexOf('pdf') != -1 || item.url.indexOf('doc') != -1 || item.url.indexOf('excel') != -1){
              item.docBtn=true
            }
            return item;
          }),
          total:res.total
        })
    })
  },
  downdoc(val){
    let url= val.currentTarget.dataset.target;
    var _this = this;
    wx.downloadFile({
      url: url,
      success: function(res) {
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function(res) {
            
          }
        })
      },
      fail: function(res) {
        console.log(res)
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
      if(this.data.list.length<this.data.total){
        this.getlist()
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})