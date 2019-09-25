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
    specialData: {},
    priceLevel: [],
    TabbarBot: app.globalData.tabbar_bottom,
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
        if (res.data.goodsinfo.factorySellerInfo.price_level) {
          let levelPrice = res.data.goodsinfo.factorySellerInfo.price_level
          levelPrice = levelPrice.split('@')
          this.data.priceLevel = []
          for (let i = 0; i < levelPrice.length; i++) {
            let itemPrice = levelPrice[i].split('-')
            this.data.priceLevel.push({
              value: itemPrice[0],
              price: itemPrice[1]
            })
          }
          this.setData({
            priceLevel: this.data.priceLevel
          })
        }
      }
    })
  },
  addCart() {
    api.get('/api-g/sc/insertShoppingCar', {
      sellerId: this.data.specialData.sellerId,
      sellerGoodsId: this.data.specialData.id,
      goodsSource: 1,
      goodsName: this.data.specialData.goods_name,
      goodsId: this.data.specialData.goods_id
    }).then(res => {
      console.log('加入购物车', res)
      if (res.resultCode == "200") {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
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
    console.log(res)
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
  setCountDown(val) {
    let time = 1000

    if (val <= 0) {
      val = 0;
    }
    let formatTime = utils.getFormat(val);
    val -= time;
    this.data.specialData['countDown'] = formatTime;
    this.setData({
      specialData: this.data.specialData
    });
    this.data.timer = setTimeout(() => {
      this.setCountDown(val)
    }, time)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let reqInfo = JSON.parse(options.params)
    this.setData({
      productParams: reqInfo
    })
    let specialStorage = JSON.parse(wx.getStorageSync('productDetail'))
    this.setData({
      specialData: specialStorage
    })
    console.log('特价详情', this.data.specialData)
    let time = this.data.specialData.expireTime - this.data.specialData.currentTime
    this.setCountDown(time)
    this.getProductDetail()
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