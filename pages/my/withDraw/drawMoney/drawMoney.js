// pages/my/withDraw/drawMoney/drawMoney.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserInforma: "",
    detailShow: false,
    poundage: "",
    actualMoney: "",
    applyMoney: "",
    withdrawBankId: ""
  },
  iptDraw(val) {
    console.log(val)
    let value = val.detail.value
    if (value == "") {
      this.setData({
        detailShow: false
      })
    } else {
      this.setData({
        detailShow: true
      })
      if (value < 1500) {
        console.log('1111')
        this.data.poundage = value * 0.0055 + 2
        this.data.poundage = this.data.poundage.toFixed(2)
        this.data.actualMoney = value - this.data.poundage
        this.data.actualMoney = this.data.actualMoney.toFixed(2)
        this.data.applyMoney = value
        this.setData({
          poundage: this.data.poundage,
          actualMoney: this.data.actualMoney,
          applyMoney: this.data.applyMoney
        })
      } else {
        console.log('222')
        this.data.poundage = value * 0.007
        this.data.poundage = this.data.poundage.toFixed(2)
        this.data.actualMoney = value - this.data.poundage
        this.data.actualMoney = this.data.actualMoney.toFixed(2)
        this.data.applyMoney = value
        this.setData({
          poundage: this.data.poundage,
          actualMoney: this.data.actualMoney,
          applyMoney: this.data.applyMoney
        })
      }
    }
  },
  confirm() {
    api.post('/api-b/draw/saveDraw', {
      withdrawApplyTotal: this.data.applyMoney,
      withdrawBankId: this.data.withdrawBankId,
      withdrawCharge: this.data.poundage,
      withdrawRealityTotal: this.data.actualMoney,
    }).then((res) => {
      console.log(res)
      if (res.resultCode == '200') {
        wx.navigateTo({
          url: '../withDraw',
        })
      }
    }).catch((err) => {
      wx.showToast({
        title: '提现失败',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      withdrawBankId: options.params
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
    let UserInforma = JSON.parse(wx.getStorageSync('UserInforma'))
    this.setData({
      UserInforma: UserInforma
    })
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