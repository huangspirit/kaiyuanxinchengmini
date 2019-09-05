//app.js

App({
  onLaunch: function() {
    // 展示本地存储能力
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.errMsg == 'login:ok')
        this.globalData.usercode['code'] = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                this.globalData.usercode['iv'] = res.iv
                this.globalData.usercode['encryptedData'] = res.encryptedData
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      }),
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
          this.globalData.CustomBar = CustomBar;
          //适配全面屏底部距离
          if (CustomBar > 75) {
            this.globalData.tabbar_bottom = "y"
          }
        }
      })
  },
 

  globalData: {
    userInfo: null,
    usercode:{},
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    version: '1.0.0',
    host: 'https://api.113ic.com',
  }
})