// pages/search/search.js
const app = getApp()
import api from '../../api/api'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:0,
    searchList: [],
    tralist:[],
    textData: [],
    brandTotal: "",
    catergoryTotal: "",
    productTotal: "",
    specialList: []
  },
  toHome() {
    wx: wx.switchTab({
      url: '../home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  gettralist(){
    api.get("/api-g/goods/queryUserHotSearch",{start:0,length:18}).then(res=>{
      console.log(res)
      this.setData({
        tralist:res.data.data
      })
    })
  },
  search(val) {
    if (val.detail.value == '') {
      this.setData({
        searchList: [],
      })
    } else {
      api.get('/api-g/gods-anon/searchIndex', {
        name: val.detail.value,
        start: 0,
        length: 10
      }).then(res => {
        this.setData({
          searchList: res.data.data,
        })
        for (let i = 0; i < this.data.searchList.length; i++) {
          this.data.searchList[i].nick_name = this.data.searchList[i].nick_name.replace('<font color="red">', "")
          this.data.searchList[i].nick_name = this.data.searchList[i].nick_name.replace('</font>', "")
          this.data.searchList[i]['nameLight'] = util.hilightWord(val.detail.value, this.data.searchList[i].nick_name)
        }
        this.setData({
          searchList: this.data.searchList,
        })
      })
    }

  },

  toDetail(val) {
    console.log(val)
    var tag = val.currentTarget.dataset['item']
    let obj = {}
   // obj['documentid'] = tag.documentid
    obj['name'] = tag.name
    obj['tag'] = tag.tag
    obj.id = tag.documentid ? tag.documentid : tag.searchId;
    obj = JSON.stringify(obj)
    console.log(obj)
    if (tag.tag == 'brand') {
      wx: wx.navigateTo({
        url: "../orSeller/orSeller?params=" + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (tag.tag == 'direct') {
     
      wx: wx.navigateTo({
        url: '../direct/direct?params=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (tag.tag == 'undirect') {
      wx: wx.navigateTo({
        url: '../undirect/undirect?params=' + obj,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (tag.tag == 'goodsinfo') {
      wx: wx.navigateTo({
        url: '../productDetail/productDetail?params=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      navH:app.globalData.navHeight
    })
    // 统计厂商产品总数的接口
    api.get("/api-g/gods-anon/querySummaryHome").then(res => {
      this.setData({
        brandTotal: res.brandTotal,
        catergoryTotal: res.catergoryTotal,
        productTotal: res.productTotal,
        specialList: res.list
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
    this.gettralist()
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