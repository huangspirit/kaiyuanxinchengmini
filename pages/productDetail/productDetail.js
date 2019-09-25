// pages/productDetail/productDetail.js
import api from '../../api/api'
import utils from '../../utils/util.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productParams: "",
    productDetail: {},
    TabbarBot: app.globalData.tabbar_bottom,
    specialList: [],
    countTimeData: [],
    timer: ""
  },
  getProductDetail() {
    api.get('/api-g/gods-anon/searchResult', {
      id: this.data.productParams.documentid,
      tag: this.data.productParams.tag,
      name: this.data.productParams.name
    }).then(res => {
      console.log('商品详情', res)
      if (res.resultCode == "200") {
        this.setData({
          productDetail: res.data.goodsinfo,
        })
        //直通车正在售卖列表
        api.get("/api-g/gods-anon/queryDirectGoods", {
          start: 0,
          length: 6,
          goods_id: this.data.productDetail.id,
          status: 1
        }).then(res => {
          console.log('特价', res)
          if (res.resultCode == "200") {
            this.setData({
              specialList: res.data.data
            })
            if (res.data.data.length > 0) {
              this.data.countTimeData = []
              for (var i = 0; i < this.data.speciaList.length; i++) {
                let countdownTime = this.data.speciaList[i].expireTime - this.data.speciaList[i].currentTime
                this.data.countTimeData.push({
                  remainTime: countdownTime,
                  countDown: ""
                })
              }
              this.setCountDown(this.data.countTimeData)
            }
          }
        })
      }
    })
  },
  setCountDown(val) {
    let time = 1000
    let list = val.map((v, i) => {
      if (v.remainTime <= 0) {
        v.remainTime = 0;
      }
      let formatTime = utils.getFormat(v.remainTime);
      v.remainTime -= time;
      v.countDown = formatTime;
      return v;
    })
    this.setData({
      countTimeData: list
    });
    this.data.timer = setTimeout(() => {
      this.setCountDown(list)
    }, time)
  },
  addFocus(val) {
    console.log(val)
    api.get('/api-g/gf/insertGoodsFavourite', {
      goods_id: val.currentTarget.dataset.item.id,
      catergory_id: val.currentTarget.dataset.item.classificationId,
      favour_type: "1"
    }).then(res => {
      console.log(res)
      if (res.resultCode == '200') {
        wx: wx.showToast({
          title: '关注成功',
          icon: 'success',
          image: '',
          duration: 800,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        this.getProductDetail()
      }
    })
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {}
    return {
      title: '分享',
      path: '/pages/productDetail/productDetail',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  toHome() {
    wx: wx.switchTab({
      url: '../home/home',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toCart() {
    wx: wx.switchTab({
      url: '../shopCart/shopCart',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  releaseSale() {
    wx.navigateTo({
      url: '../releaseSale/releaseSale',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let reqInfo = JSON.parse(options.params)
    this.setData({
      productParams: reqInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getProductDetail()
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
    clearTimeout(this.data.timer)
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