// pages/my/withDraw/changePassword/changePassword.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passDetail: {
      oldPass: "",
      newPass: "",
      againPass: ""
    }
  },
  oldPass(val) {
    this.data.passDetail.oldPass = val.detail.value
    this.setData({
      passDetail: this.data.passDetail
    })
  },
  newPass(val) {
    this.data.passDetail.newPass = val.detail.value
    this.setData({
      passDetail: this.data.passDetail
    })
  },
  againPass(val) {
    this.data.passDetail.againPass = val.detail.value
    this.setData({
      passDetail: this.data.passDetail
    })
  },
  confirm() {
    if (this.data.passDetail.oldPass == '') {
      wx.showToast({
        title: '请输入旧密码',
        icon: 'none'
      })
      return
    }
    if (this.data.passDetail.newPass == '') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return
    }
    if (this.data.passDetail.againPass == '') {
      wx.showToast({
        title: '请确认新密码',
        icon: 'none'
      })
      return
    }
    if (this.data.passDetail.newPass != this.data.passDetail.againPass) {
      wx.showToast({
        title: '两次密码输入不同',
        icon: 'none'
      })
      return
    }

    api.post('/api-b/draw/updatedrawPassword', {
      newpassword: this.data.passDetail.newPass,
      password: this.data.passDetail.oldPass,
      renewpassword: this.data.passDetail.againPass,
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