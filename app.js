//app.js

App({
  onReady: function() {

  },
  onLaunch: function(options) {
    // 展示本地存储能力
    wx.setStorageSync('isBuyer', true)
    // // 登录
    wx.login({
      success: res => {
        console.log('授权登录', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.errMsg == 'login:ok')
          this.globalData.usercode['code'] = res.code;
          this.getUsrInfo()
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
          } else {
            wx.openSetting({
              success: res => {
                console.log(res)
              },
              fail: res => {
                console.log(res)
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
  getUsrInfo() {
    wx.request({
      url: `${this.globalData.host}/api-u/users/current`,
      method: 'get',
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success(request) {
        if (request.statusCode === 200) {
          // console.log("初始登录获取用户信息:", request.data);
          let UserInforma = JSON.stringify(request.data)
          wx.setStorageSync('UserInforma', UserInforma)
        } else if (request.statusCode === 401) {
          // 401 说明 token 验证失败
          // 可以直接跳转到登录页面，重新登录获取 token
          wx: wx.removeStorageSync('token')
          wx: wx.removeStorageSync('refreshToken')
          wx: wx.navigateTo({
            url: '/pages/index/index',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        else {
          reject(request.data)
        }
      },
      fail(error) {
        console.log(error)
        reject(error.data)
      }
    })
  },
  globalData: {
    userInfo: null,
    usercode: {},
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    version: '1.0.0',
    classType: 0,
    host: 'https://api.113ic.com',
    errorImg: '/img/public/errorImg.png',
    title: '大麦晶城',
    baseURL3: "http://brand.113ic.com"
    // errorImg: "http://brand.113ic.com/6cb875d1fc454665a3e78b5ac675e391.jpg"
  }
})