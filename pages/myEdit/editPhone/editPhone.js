// pages/myEdit/editPhone/editPhone.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyPhone: "",
    getcodeText: "获取验证码",
    btnShow: true,
    codeKey: "",
    codeText: "",
    selcTgetcodeText: "获取验证码",
    selcTbtnShow: true,
    selcTcodeKey: "",
    selcTcodeText: "",
    newPhone: ""
  },
  newPhone(val) {
    console.log(val)
    let text = val.detail.value
    text = text.replace(/\s*/g, "")
    this.setData({
      newPhone: text
    })
    if (text.length >= 11) {
      api.post('/api-u/users/queryphone?type=0&' + 'phone=' + this.data.newPhone, {
        phone: this.data.newPhone
      }).then((res) => {
        console.log(res)
        if (res.resultCode == "200") {

        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }

      })
    }
  },
  selcTcodeText(val) {
    this.setData({
      selcTcodeText: val.detail.value
    })
  },
  selcTgetCode() {
    if (this.data.newPhone == "") {
      wx.showToast({
        title: '请输入手机号',
      })
      return
    }
    var count = 60
    var that = this
    var timer = setInterval(() => {
      that.setData({
        selcTgetcodeText: count + "秒后重新发送",
        selcTbtnShow: false
      })
      count--
      if (count == 0) {
        clearInterval(timer)
        that.setData({
          selcTgetcodeText: "获取验证码",
          selcTbtnShow: true
        })
      }
    }, 1000)
    api.post('/api-n/notification-anon/codes?type=0&' + 'phone=' + this.data.newPhone, {
      type: 0,
      phone: this.data.newPhone
    }).then((res) => {
      console.log(res)
      this.setData({
        selcTcodeKey: res.key
      })
    })
  },

  confirm() {
    if (this.data.newPhone == "") {
      wx.showToast({
        title: '请输入手机号',
      })
      return
    }
    if (this.data.selcTcodeText == "") {
      wx.showToast({
        title: '请输入验证码',
      })
      return
    }
    api.post('/api-u/users/replacePhone?type=0&' + 'key=' + this.data.selcTcodeKey + '&code' + this.data.selcTcodeText + 'phone=' + this.data.newPhone, {
      key: this.data.selcTcodeKey,
      code: this.data.selcTcodeText,
      phone: this.data.newPhone,
    }).then((res) => {
      console.log(res)
      wx.navigateTo({
        url: '../myEdit/myEdit',
      })
    })

  },
  popupConfirm() {
    if (this.data.codeText == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    api.get('/api-n/notification-anon/phone', {
      key: this.data.codeKey,
      code: this.data.codeText
    }).then((res) => {
      console.log(res)
      this.dialog.hide()
    })
  },
  popupCancel() {
    console.log('取消')
    this.dialog.hide()
    wx.navigateBack({
      delta: 2
    })
  },
  getCode() {
    var count = 60
    var that = this
    var timer = setInterval(() => {
      that.setData({
        getcodeText: count + "秒后重新发送",
        btnShow: false
      })
      count--
      if (count == 0) {
        clearInterval(timer)
        that.setData({
          getcodeText: "获取验证码",
          btnShow: true
        })
      }
    }, 1000)
    api.post('/api-n/notification-anon/codes?type=0&' + 'phone=' + this.data.historyPhone, {
      type: 0,
      phone: this.data.historyPhone
    }).then((res) => {
      console.log(res)
      this.setData({
        codeKey: res.key
      })
    })
  },
  codeIpt(val) {
    this.setData({
      codeText: val.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      historyPhone: options.params
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent('#dialog')
    // this.dialog.show()
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