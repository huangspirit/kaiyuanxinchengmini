// pages/spotSpecial/spotSpecial.js
import api from '../../api/api'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseURL3: app.globalData.baseURL3,
    classList: [],
    spotList: [],
    errorImg:app.globalData.errorImg,
    currentPage:1,
    pageSize:9,
    loadModal:false,
    showCover:false,
    siderIndex: 0,
    name:'',
    sendData:{}
    
  },
  toSearch(val) {
    this.setData({
      loadModal: true,
      currentPage: 1,
      name: val.detail.value
    })
    var index = 0
    let obj = {
      start: (this.data.currentPage - 1) * this.data.pageSize,
      length: this.data.pageSize,
      status: 1,
      name: val.detail.value,
      ...this.data.sendData
    }
    if (this.data.siderIndex != 0) {
      obj.catergory_id = this.data.classList[this.data.siderIndex].id
    } else {
      delete obj.catergory_id;
    }
    api.get('/api-g/gods-anon/queryDirectGoods', obj).then((res) => {
      this.setData({
        spotList: res.data.data.map(item => {
          if (item.sellerGoodsImageUrl) {
            item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
          }
          return item;
        }),
        loadModal: false,
        showCover: false
      })
    })
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
      start: (this.data.currentPage - 1) * this.data.pageSize,
      length: this.data.pageSize,
      status: 1,
      ...this.data.sendData
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
        spotList: arr.map(item=>{
          if (item.sellerGoodsImageUrl) {
            item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
          }
          return item;
        }),
        loadModal:false
      })
    })
    }
  },
  toDetail(val) {
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?seller_goods_id=' + val.currentTarget.dataset.item.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getclassList() {
    api.get('/api-g/gods-anon/queryDirectC', {
      goods_type: true,
      start: 0,
      length: 100,
      ...this.data.sendData
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

      start: (this.data.currentPage-1)*this.data.pageSize,
      length: this.data.pageSize,
      status: 1,
      ...this.data.sendData
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
          spotList: res.data.data.map(item => {
            if (item.sellerGoodsImageUrl) {
              item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
            }
            return item;
          }),
          loadModal:false,
          showCover:false
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj={}
    obj[options.tag]=options.value
    this.setData({
      sendData:obj
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
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
    this.getMoreList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})