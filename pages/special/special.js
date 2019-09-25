// pages/special/special.js
const app = getApp()
import api from '../../api/api'
import utils from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    var index = 0
    if (val) {
      console.log('1111')
      this.setData({
        siderIndex: val.currentTarget.dataset.index
      })
      index = val.currentTarget.dataset.index
    }
    clearTimeout(this.data.timer)

    if (index == 2) {
      api.get('/api-g/gods-anon/queryDirectGoods', {
        start: 0,
        length: 100,
        is_old_product: true,
        status: 1
      }).then(res => {
        console.log(res)
        this.setData({
          speciaList: res.data.data
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
      })
    } else if (index == 1) {
      api.get('/api-g/gods-anon/queryDirectGoods', {
        start: 0,
        length: 100,
        goods_type: false,
        status: 1
      }).then(res => {
        console.log(res)
        this.setData({
          speciaList: res.data.data
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
      })
    } else if (index == 0) {
      api.get('/api-g/gods-anon/queryDirectGoods', {
        start: 0,
        length: 100,
        goods_type: true,
        status: 0
      }).then(res => {
        console.log(res)
        this.setData({
          speciaList: res.data.data
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
      })
    }
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
  toSearch() {
    wx: wx.navigateTo({
      url: '../search/search',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})