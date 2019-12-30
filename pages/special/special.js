// pages/special/special.js
const app = getApp()
import api from '../../api/api'
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorImg:app.globalData.errorImg,
    specialSider: [{
      name: '现货',
      id: '0'
    }, {
      name: '订货',
      id: '1'
    }, {
      name: '呆料',
      id: '2'
    }, ],
    siderIndex: 0,
    speciaList: [],
    silderParams: {},
    timer: "",
    countTimeData: []
  },
  siderChange(val) {
    clearTimeout(this.data.timer)
    this.setData({
      loadModal: true
    })
    var index = 0
    if (val) {
      this.setData({
        siderIndex: val.currentTarget.dataset.index
      })
      index = val.currentTarget.dataset.index
    }
    let obj={}
    if(index==2){
      obj={
        start: 0,
        length: 100,
        is_old_product: true,
        status: 1
      }
    }else if(index==1){
      obj={
        start: 0,
        length: 100,
        goods_type: false,
        status: 1
      }
    }else if(index==0){
      obj = {
        start: 0,
        length: 100,
        goods_type: true,
        status: 1
      }
    }
    api.get('/api-g/gods-anon/queryDirectGoods', obj).then(res => {
      this.setData({
        loadModal: false
      })
      if (res.data.data.length > 0) {
        let specialList = res.data.data.map(item => {
          if (item.expireTime){
            let countdownTime = item.expireTime - item.currentTime;
            item.remainTime = countdownTime;
            item.countDown=""
          }
          return item;
        })
        this.setData({
          speciaList: specialList,
        })
      }else{
        this.setData({
          speciaList:[],
        })
      }
      this.setCountDown()
      })
  },
  setCountDown: function () {
    var _this=this;
    let time = 100;
    let { speciaList } = this.data;
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
  toSearch() {
    wx: wx.navigateTo({
      url: '../search/search',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  goodsDetail(val) {
    console.log(val)
    var obj = {}
    obj['documentid'] = val.currentTarget.dataset.item.goods_id
    obj['tag'] = 'goodsinfo'
    obj['name'] = val.currentTarget.dataset.item.goods_name
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})