// pages/center/buyer/myInquiry/myInquiry.js
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
    TabCur: 0,
    navList: [
      {
        name:"全部",
        id:0
      },
      {
        name: '待批复',
        key:"reply_status",
        value:false,
        id:1
      },
      {
        name:"已批复",
        key:"reply_status",
        value:true,
        id:2
      },
      {
        name: "已失效",
        key: "sheet_effective",
        value: false,
        id: 3
      }],
      currentNav:{},
      list:[],
      pageSize:10,
      currentPage:1
  },
  getlist(){
    let obj = {
      start:(this.data.currentPage-1)*this.data.pageSize,
      length:this.data.pageSize,
      type:true
    }
    if (this.data.currentNav.key){
      obj[this.data.currentNav.key] = this.data.currentNav.value
    }
    api.get("/api-g/ic/queryInquirySheetList",obj).then(res=>{
      if(this.data.currentPage==1){
        if(res.data){
          this.setData({
            total: res.data.total,
            list: res.data.data
          })
        }else{
          this.setData({
            total: 0,
            list: []
          })
        }
      }else{
        this.setData({
          list:this.data.list.concat(res.data.data) 
        })
      }
      
    })
  },
  tabSelect(val){
    console.log(val)
    this.setData({
      currentNav:this.data.navList[Number(val.currentTarget.dataset.index)],
      TabCur: this.data.navList[Number(val.currentTarget.dataset.index)].id,
      currentPage:1
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
      if(this.data.list.length<this.data.total){
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