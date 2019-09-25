// pages/my/withDraw/addWithdraw/addWithdraw.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{
        name: '工商银行',
        value: 'ICBC'
      },
      {
        name: '农业银行',
        value: 'ABC'
      },
      {
        name: '建设银行',
        value: 'CCB'
      },
      {
        name: '招商银行',
        value: 'CMB'
      },
      {
        name: '交通银行',
        value: 'COMM'
      },
      {
        name: '支付宝',
        value: 'alipay'
      }
    ],
    bindDetail: {
      bankName: "",
      bankAdress: "",
      bankCard: "",
      bankCode: "ICBC"
    },
    index: 0,
    bandAdressShow: true
  },
  bindPickerChange: function(e) {
    console.log('picker下拉项发生变化后，下标为：', e.detail.value)
    if (e.detail.value == 5) {
      this.setData({
        bandAdressShow: false
      })
    } else {
      this.setData({
        bandAdressShow: true
      })
    }
    this.data.bindDetail.bankCode = this.data.array[e.detail.value].value
    this.setData({
      index: e.detail.value,
      bindDetail: this.data.bindDetail
    })
  },
  bankName(val) {
    console.log(val)
    this.data.bindDetail.bankName = val.detail.value
    this.setData({
      bindDetail: this.data.bindDetail
    })
  },
  bankAdress(val) {
    console.log(val)
    this.data.bindDetail.bankAdress = val.detail.value
    this.setData({
      bindDetail: this.data.bindDetail
    })
  },
  bankCard(val) {
    this.data.bindDetail.bankCard = val.detail.value
    this.setData({
      bindDetail: this.data.bindDetail
    })
  },
  confirm() {
    api.post('/api-b/draw/saveBank', {
      bankCode: this.data.bindDetail.bankCode,
      bankName: this.data.bindDetail.bankAdress,
      bankNumber: this.data.bindDetail.bankCard,
      cnname: this.data.bindDetail.bankName
    }).then((res) => {
      console.log(res)
      if (res.resultCode == "200") {
        wx.navigateTo({
          url: '../withDraw',
        })
      }
    })
  },
  cancel() {
    wx.navigateTo({
      url: '../withDraw',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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