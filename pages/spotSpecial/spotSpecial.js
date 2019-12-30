// pages/spotSpecial/spotSpecial.js
import api from '../../api/api'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    spotList: [],
    siderIndex: 0,
    errorImg:app.globalData.errorImg,
    currentPage:1,
    pageSize:9,
    loadModal:false,
    showCover:false
    
  },
  showCoverTap(){
    this.setData({
      showCover:true
          })
  },
  hideCoverTap(){
    this.setData({
      showCover: false
    })
  },
  getMoreList(){
   
    if(this.data.spotList.length==this.data.currentPage*this.data.pageSize){
      this.setData({
        currentPage:this.data.currentPage+1,
        loadModal:true
      });
    
    let obj = {
      goods_type: true,
      start: (this.data.currentPage - 1) * this.data.pageSize,
      length: this.data.pageSize,
      status: 1,
    }
    
    if (this.data.siderIndex != 0) {
      obj.catergory_id = this.data.classList[this.data.siderIndex].id
    } else {
      delete obj.catergory_id;
    }
    api.get('/api-g/gods-anon/queryDirectGoods', obj).then((res) => {
     wx.hideLoading()
      let arr=this.data.spotList.concat(res.data.data)
      this.setData({
        spotList: arr,
        loadModal:false
      })
    })
    }
  },
  toDetail(val) {
    var obj = {
      documentid:val.currentTarget.dataset.item.goods_id,
      tag:'goodsinfo',
      name:val.currentTarget.dataset.item.goods_name
    }
    var routerParams = JSON.stringify(obj)
    let storageItem = JSON.stringify(val.currentTarget.dataset.item)
    wx: wx.setStorageSync('productDetail', storageItem)
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?params=' + routerParams,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getclassList() {
    api.get('/api-g/gods-anon/queryDirectC', {
      goods_type: true,
      start: 0,
      length: 100
    }).then((res) => {
      console.log(res)
      this.setData({
        classList: res.data.list
      })
    })
  },
  siderChange(val) {
  this.setData({
    loadModal:true,
    currentPage:1
  })
    var index = 0
    let obj={
      goods_type: true,
      start: (this.data.currentPage-1)*this.data.pageSize,
      length: this.data.pageSize,
      status: 1,
    }
    if (val) {
      this.setData({
        siderIndex: val.currentTarget.dataset.index + 1
      })
      index = val.currentTarget.dataset.index + 1
    }
      if (index != 0) {
        obj.catergory_id=val.currentTarget.dataset.item.id
      } else {
        delete obj.catergory_id;
      }
      api.get('/api-g/gods-anon/queryDirectGoods', obj).then((res) => {
        
        this.setData({
          spotList: res.data.data,
          loadModal:false,
          showCover:false
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getclassList()
    this.siderChange()
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