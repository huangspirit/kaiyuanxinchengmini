// pages/my/agencyQualification/agencyDetail/agencyDetail.js
import api from '../../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agentcyDetail: {},
    agencyPicshow: false,
  },
  agencyPic() {
    this.setData({
      agencyPicshow: true
    })
  },
  closeAgency() {
    this.setData({
      agencyPicshow: false
    })
  },
  addAgency() {
    api.get('/api-b/customerCenter/delQualificationList', {
      id: this.data.agentcyDetail.id
    }).then(res => {
      if (res.resultCode) {
        wx.showToast({
          title: "撤销成功",
        })
        wx.navigateTo({
          url: '../agencyQualification',
        })
      }
    }).catch((err) => {
      console.log(err)
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let params = JSON.parse(options.params)
    this.setData({
      agentcyDetail: params
    })
    console.log(params)
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