//index.js
//获取应用实例
const app = getApp()
import api from '../../api/api'
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone: "",
    phoneCode: "",
    phoneKey: "",
    phoneState: "",
    btnShow: true,
    getcodeText: "获取验证码",
    loadModal: false
  },
  //事件处理函数
  bindViewTap: function() {
    console.log(app.globalData)
    this.setData({
      loadModal: true
    })


    api.get('/api-u/wechat/smart/smartback', app.globalData.usercode).then(res => {
      console.log(res)
      this.setData({
        phoneState: res.data.state
      })
      this.setData({
        loadModal: false
      })
      if (res.data.userId != null) {
        var openid = res.data.unionid
        var state = encodeURIComponent(res.data.state)
        api.post('/sys/login-wechat?' + `openid=${openid}&state=${state}`, {
          openid: openid,
          state: decodeURIComponent(state)
        }).then(res => {
          console.log(res)
          wx.setStorageSync('token', res.access_token)
          wx.setStorageSync('refreshToken', res.refresh_token)
          wx: wx.switchTab({
            url: '../home/home',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        })
      } else {
        this.dialog.show()
      }

    })
    // wx.switchTab({
    //   url: '../home/home',
    // })
  },
  getphoneCode(val) {
    console.log(this.data.phone)
    if (this.data.phone == null || this.data.phone == "") {
      console.log('222')
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
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
      api.get('/api-n/notification-anon/codes', {
        phone: this.data.phone,
        type: 1
      }).then(res => {
        console.log(res)
        this.setData({
          phoneKey: res.key
        })
      })
    }

  },
  bindKeyInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCodeInput(e) {
    this.setData({
      phoneCode: e.detail.value
    })
  },
  popupCancel() {
    console.log('取消')
    this.dialog.hide()
  },
  popupConfirm(val) {
    var flag = ""
    if (val == true) {
      flag = true
    } else {
      flag = false
    }
    console.log('确认')
    api.get('/api-u/users-anon/bindingwphone', {
      phone: this.data.phone,
      key: this.data.phoneKey,
      code: this.data.phoneCode,
      state: this.data.phoneState,
      flag: flag,
      type: 'smart'
    }).then(res => {
      console.log(res)
      if (res.resultCode == '5001') {
        this.dialog.hide()
        var that = this
        wx: wx.showModal({
          title: '提示',
          content: res.message,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '',
          success: function(res) {
            console.log('成功', res)
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              //点击确定
              that.popupConfirm(true)
            }
          },
          fail: function(res) {
            console.log('失败', res)
          },
          complete: function(res) {},
        })
      } else if (res.resultCode === "200") {
        var state = encodeURIComponent(res.data.state)
        api.post('/sys/login-wechat?' + `openid=${res.data.openid}&state=${state}`, {
          openid: res.data.openid,
          state: decodeURIComponent(state)
        }).then(res => {
          console.log(res)
          wx.setStorageSync('token', res.access_token)
          wx.setStorageSync('refreshToken', res.refresh_token)
          wx: wx.switchTab({
            url: '../home/home',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        })
      }
    })
  },
  onLoad: function() {
    wx.login({
      success: res => {
        console.log('授权登录', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.errMsg == 'login:ok')
          app.globalData.usercode['code'] = res.code
        wx.getSetting({
          success: res => {
            
            if (res.authSetting['scope.userInfo'] == true) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  app.globalData.userInfo = res.userInfo
                  app.globalData.usercode['iv'] = res.iv
                  app.globalData.usercode['encryptedData'] = res.encryptedData
                  this.getUserInfo(res)
                }
              })
            } else if (res.authSetting['scope.userInfo'] == false) {
              wx.openSetting({
                success: res => {
                  console.log(res)
                },
                fail: res => {
                  console.log(res)
                }
              })
            } else {
              wx.getUserInfo({
                success: res => {
                  console.log(res)
                  this.getUserInfo(res)
                },
                fail: res => {
                  console.log(res)
                  wx.openSetting({
                    success: res => {
                      console.log(res)
                    },
                    fail: res => {
                      console.log(res)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          app.globalData.usercode['iv'] = res.iv
          app.globalData.usercode['encryptedData'] = res.encryptedData
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function() {
    this.dialog = this.selectComponent('#dialog')
  },
  getUserInfo: function(e) {
    console.log(e)

    if (e.detail) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.usercode['iv'] = e.detail.iv
        app.globalData.usercode['encryptedData'] = e.detail.encryptedData
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        this.bindViewTap()
      } else {
        wx: wx.switchTab({
          url: '../home/home',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }

    } else if (e.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.userInfo
      app.globalData.usercode['iv'] = e.iv
      app.globalData.usercode['encryptedData'] = e.encryptedData
      this.setData({
        userInfo: e.userInfo,
        hasUserInfo: true
      })
    }

  }
})