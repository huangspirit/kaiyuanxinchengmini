// pages/my/withDraw/withDraw.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList: [],
    drawText: "更改提现密码",
    drawPass: "",
    isPassword: "",
    withdrawId:""
  },
  addWithdraw() {
    wx.navigateTo({
      url: './addWithdraw/addWithdraw',
    })
  },
  changePass() {
    wx.navigateTo({
      url: './changePassword/changePassword',
    })
  },
  getBankList() {
    api.get('/api-b/draw/getBankList', {
      start: 0,
      length: 20
    }).then((res) => {
      console.log(res)
      this.setData({
        bankList: res.data.data
      })
    })
  },
  delBank(val) {
    console.log(val)
    var that = this
    wx.showModal({
      title: '解绑提示',
      content: '是否确认解绑银行卡',
      success: function(res) {
        if (res.confirm) {
          let id = val.currentTarget.dataset.item
          api.get('/api-b/draw/deleBank?id=25', {
            id: id
          }).then((res) => {
            console.log(res)
            that.getBankList()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toDraw(val) {
    console.log(val)
    this.setData({
      withdrawId:val.currentTarget.dataset.item
    })
    if (this.data.isPassword == 0) {
      this.dialog1.show()
    } else if (this.data.isPassword == 1) {
      this.dialog.show()
    }

  },
  checkedPass() {
    api.get('/api-b/draw/checkSetPassword', {}).then((res) => {
      console.log(res)
      if (res.resultCode == "200") {
        if (res.data == 0) {
          this.setData({
            drawText: "设置提现密码",
            isPassword: res.data
          })
        } else if (res.data == 1) {
          this.setData({
            drawText: "更改提现密码",
            isPassword: res.data
          })
        }
      }
    })
  },
  popupCancel() {
    console.log('取消')
    this.dialog.hide()
  },
  cancel() {
    this.dialog1.hide()
  },
  drawPass(val) {
    this.setData({
      drawPass: val.detail.value
    })
  },
  popupConfirm() {
    console.log(this.data.drawPass)
    if (this.data.drawPass) {
      api.post('/api-b/draw/checkdrawPassword', {
        password: this.data.drawPass
      }).then((res) => {
        console.log(res)
        if (res.resultCode) {
          
          wx.navigateTo({
            url: './drawMoney/drawMoney?params=' + this.data.withdrawId,
          })
        }
      }).catch((err) => {
        console.log(err)
        wx.showToast({
          title: err.message ,
          icon: 'none'
        })
      })
    } else {
      wx.showToast({
        title: '请输入提现密码',
        icon: 'none'
      })
    }
    console.log('确认')
  },
  confirm() {
    console.log('设置密码确认')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBankList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent('#dialog')
    this.dialog1 = this.selectComponent('#dialog1')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.checkedPass()
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