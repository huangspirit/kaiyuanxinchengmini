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
    currentPage:1,
    pageSize:6,
    total:0,
    countTimeData: [],
    timer: "",
    errorImg:app.globalData.errorImg,
    loadModal: false,
    timerCount:0,
    getMoreMark:false
  },
  getMoreSpecial(){
    this.setData({
      currentPage:this.data.currentPage+1,
      loadModal:true
    })
    this.getSpecialList()
  },
  getSpecialList(){
    //器件售卖商家列表
    api.get("/api-g/gods-anon/queryDirectGoods", {
      start: this.data.pageSize * (this.data.currentPage - 1),
      length: this.data.pageSize,
      goods_id: this.data.productDetail.id,
      status: 1
    }).then(res => {
      if (res.resultCode == "200") {
        clearTimeout(this.data.timer);
        this.setData({
          loadModal: false,
          total: res.data.total
        })
        if (res.data.data.length > 0) {
            this.setData({
              getMoreMark: res.data.data.length == this.data.pageSize?true:false
            })
          let specialList = res.data.data.map(item => {
            if (item.expireTime) {
              let countdownTime = item.expireTime - item.currentTime;
              item.remainTime = countdownTime;
              item.countDown = "";
            }
            return item;
          })
          if(this.data.currentPage==1){
            this.setData({
              specialList: specialList
            })
          }else{
            this.setData({
              specialList: this.data.specialList.concat(specialList),
            })
          }
          
        } else {
          this.setData({
            speciaList: [],
            getMoreMark:false
          })
        }
        this.setCountDown()
      }
    })
  },
  getProductDetail() {
    this.setData({
      loadModal:true
    })
    api.get('/api-g/gods-anon/searchResult', {
      id: this.data.productParams.id,
      tag: this.data.productParams.tag,
      name: this.data.productParams.name
    }).then(res => {
      if (res.resultCode == "200") {
        this.setData({
          productDetail: res.data.goodsinfo,
        })
        this.getSpecialList()
      }
    })
  },
  setCountDown() {
    var _this=this;
    let time = 1000
    let specialList = this.data.specialList;
    let count=0;
    let list = specialList.map((v, i) => {
      if (!v.remainTime || v.remainTime <= 0) {
        v.remainTime = 0;
      }else{
        count=count+1
      }
      let formatTime = utils.getFormat(v.remainTime);
      v.remainTime -= time;
      v.countDown = formatTime;
      return v;
    })
   if(count==0){
     return;
   }
    this.setData({
      specialList: list,
      timer: setTimeout(() => {
        _this.setCountDown()
      }, time)
    });
  },
  addFocus(val) {
    api.get('/api-g/gf/insertGoodsFavourite', {
      goods_id: val.currentTarget.dataset.item.id,
      catergory_id: val.currentTarget.dataset.item.classificationId,
      favour_type: "1"
    }).then(res => {
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
        api.get('/api-g/gods-anon/searchResult', {
          id: this.data.productParams.id,
          tag: this.data.productParams.tag,
          name: this.data.productParams.name
        }).then(res => {
          if (res.resultCode == "200") {
            this.setData({
              productDetail: res.data.goodsinfo,
            })
          }
        })
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
  toseller(val){
    let item = val.currentTarget.dataset.item;
    if (item.tag == 1) {
      let obj = {
        tag: 'brand',
        id: item.brandId,
        name: item.brandName
      }
      wx: wx.navigateTo({
        url: '../orSeller/orSeller?params=' + JSON.stringify(obj),
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx: wx.navigateTo({
        url: '../agSeller/agSeller?seller_id=' + item.sellerId + '&name=' + item.sellerName,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  releaseSale() {
    wx.navigateTo({
      url: '../releaseSale/releaseSale?name=' + this.data.productDetail.productno
    })
  },
  purchase(){

  },
  toDetail(val) {
    var currentItem = this.data.specialList[val.currentTarget.dataset.index];
    console.log(currentItem)
    var obj = {}
    obj['id'] = currentItem.goods_id
    obj['tag'] = 'goodsinfo'
    obj['name'] = currentItem.goods_name
    var routerParams = JSON.stringify(obj)
    let storageItem = JSON.stringify(currentItem)
    wx: wx.setStorageSync('productDetail', storageItem)
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?params=' + routerParams,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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