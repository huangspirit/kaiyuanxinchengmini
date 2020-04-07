// pages/special/special.js
const app = getApp()
import api from '../../api/api'
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopNav:false,
    navH:app.globalData.navHeight,
    baseURL3: app.globalData.baseURL3,
    errorImg: app.globalData.errorImg,
    specialSider: [{
        name: "全部"
      },
      {
        name: '现货',
        tag: 'goods_type',
        value: true,
      }, {
        name: '订货',
        tag: "goods_type",
        value: false,
      }, {
        name: '呆料',
        tag: "is_old_product",
        value: true,
      },
    ],
    siderIndex: 0,
    speciaList: [],
    total:0,
    silderParams: {},
    timer: "",
    countTimeData: [],
    start:0,
    length:10,
    name:""
  },
  getResult(){
    clearTimeout(this.data.timer)
    this.setData({
      loadModal: true
    })
    let obj={
      start:this.data.start,
      length:this.data.length,
    }
    if (this.data.specialSider[this.data.siderIndex].tag) {
      obj[this.data.specialSider[this.data.siderIndex].tag] = this.data.specialSider[this.data.siderIndex].value
    }
    if (this.data.name) {
      obj.name = this.data.name
    }
    api.get('/api-g/gods-anon/queryDirectGoods', obj).then(res => {
      this.setData({
        loadModal: false,
        total:res.data.total
      })
      let specialList=[]
      if (res.data.data.length > 0) {
       specialList = res.data.data.map(item => {
          if (item.sellerGoodsImageUrl) {
            item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
          }
          if (item.expireTime) {
            let countdownTime = item.expireTime - item.currentTime;
            item.remainTime = countdownTime;
            item.countDown = ""
          }
          return item;
        })
      }
      if(this.data.start==0){
        this.setData({
          speciaList: specialList,
        })
      }else{
        this.setData({
          speciaList: this.data.speciaList.concat(specialList),
        })
      }
      
      this.setCountDown()
    })
  },
  siderChange(val) {
    if (val) {
      this.setData({
        siderIndex: val.currentTarget.dataset.index
      })
    }
    this.getResult()
  },
  setCountDown: function() {
    var _this = this;
    let time = 100;
    let {
      speciaList
    } = this.data;
    let list = speciaList.map((v, i) => {
      if (v.remainTime <= 0) {
        v.remainTime = 0;
      }
      let formatTime = utils.getFormat(v.remainTime);
      v.remainTime -= time;
      v.countDown = formatTime;
      return v;
    })
    this.setData({
      speciaList: list,
      timer: setTimeout(_this.setCountDown, time)
    });
  },
  toSearch(val) {
    this.setData({
      start:0,
      name: val.detail.value
    })
    this.getResult();
  },
  goodsDetail(val) {
    var obj = {}
    obj['id'] = val.currentTarget.dataset.item.goods_id
    obj['tag'] = 'goodsinfo'
    obj['name'] = val.currentTarget.dataset.item.goods_name
    var routerParams = JSON.stringify(obj)
    let storageItem = JSON.stringify(val.currentTarget.dataset.item)
    wx: wx.setStorageSync('productDetail', storageItem)
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?params=' + routerParams,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    if (this.data.total > this.data.start + this.data.length){
      this.setData({
        start: this.data.start + this.data.length
      })
      this.getResult()
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})