// pages/personalInfo/personalInfo.js
import api from '../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userDetail: {}
  },
  getUsreInfo() {
    api.get("/api-u/users/current", {}).then(res => {
      console.log('个人信息', res)
      this.setData({
        userDetail: res
      })
    })
  },
  //点击图片选择手机相册或者电脑本地图片
  changeAvatar: function(e) {
    var _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //这里是上传操作
        wx.uploadFile({
          url: 'https://api.113ic.com/api-f/files/uploadHead?access_token=' + wx.getStorageSync('token'), //里面填写你的上传图片服务器API接口的路径 
          filePath: tempFilePaths[0], //要上传文件资源的路径 String类型 
          name: 'file', //按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'access_token': wx.getStorageSync('token')
          },
          success: function(res) {
            console.log(JSON.parse(res.data))
            //当调用uploadFile成功之后，再次调用后台修改的操作，这样才真正做了修改头像
            if (res.resultCode = 200) {
              //这里调用后台的修改操作， tempFilePaths[0],是上面uploadFile上传成功，然后赋值到修改这里。
              api.put("/api-u/users/me", {
                headImgUrl: JSON.parse(res.data).data
              }).then(res => {
                console.log('上传头像', res)
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 1500
                })
                _this.data.userDetail.headImgUrl = res.headImgUrl
                _this.setData({
                  userDetail: _this.data.userDetail
                })
              })
            }
          }
        })
      }
    })
  },
  nameChange(e) {
    this.data.userDetail.nickname = e.detail.value
    this.setData({
      userDetail: this.data.userDetail
    })
  },
  sexChange() {
    var _this = this
    wx.showActionSheet({
      itemList: ['男', '女'], //显示的列表项
      success: function(res) { //res.tapIndex点击的列表项
        console.log("点击了列表项：", res, _this)
        if (res.tapIndex == 0) {
          _this.data.userDetail.sex = '1'
        } else if (res.tapIndex == 1) {
          _this.data.userDetail.sex = '2'
        }
        _this.setData({
          userDetail: _this.data.userDetail
        })
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  confirm() {
    api.put("/api-u/users/me", {
      headImgUrl: this.data.userDetail.headImgUrl,
      nickname: this.data.userDetail.nickname,
      sex: this.data.userDetail.sex
    }).then(res => {
      console.log('上传头像', res)
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500
      })
      this.data.userDetail.headImgUrl = res.headImgUrl
      this.setData({
        userDetail: this.data.userDetail
      })
      api.post("/sys/refresh_token?refresh_token=" + wx.getStorageSync('refreshToken'), {
        refresh_token: wx.getStorageSync('refreshToken')
      }).then(res => {
        console.log('刷新token', res)
        wx.setStorageSync('token', res.access_token)
        wx.setStorageSync('refreshToken', res.refresh_token)
        wx.navigateTo({
          url: '../myEdit/myEdit',
        })
      })

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUsreInfo()
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