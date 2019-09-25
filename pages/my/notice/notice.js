// pages/my/notice/notice.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    navList: ['发货', '审核', '询价', '支付', '系统'],
    noticeList: []
  },
  tabSelect(e) {
    if (e) {
      this.data.TabCur = e.currentTarget.dataset.id;
      this.setData({
        TabCur: this.data.TabCur
      })
    }
    if (this.data.TabCur == 0) {
      api.get('/api-n/notification/queryUserMessageList', {
        tag: 'dg',
        start: 0,
        length: 1000,
      }).then((res) => {
        console.log(res)
        this.setData({
          noticeList: res.data.data
        })
      })
    }
    if (this.data.TabCur == 1) {
      api.get('/api-n/notification/queryUserMessageList', {
        tag: 'auth',
        start: 0,
        length: 1000,
      }).then((res) => {
        console.log(res)
        this.setData({
          noticeList: res.data.data
        })
      })
    }
    if (this.data.TabCur == 2) {
      api.get('/api-n/notification/queryUserMessageList', {
        tag: 'inquiry',
        start: 0,
        length: 1000,
      }).then((res) => {
        console.log(res)
        this.setData({
          noticeList: res.data.data
        })
      })
    }
    if (this.data.TabCur == 3) {
      api.get('/api-n/notification/queryUserMessageList', {
        tag: 'zfs',
        start: 0,
        length: 1000,
      }).then((res) => {
        console.log(res)
        this.setData({
          noticeList: res.data.data
        })
      })
    }
    if (this.data.TabCur == 4) {
      api.get('/api-n/notification/queryUserMessageList', {
        tag: 'sys',
        start: 0,
        length: 1000,
      }).then((res) => {
        console.log(res)
        this.setData({
          noticeList: res.data.data
        })
      })
    }
  },
  getMessage() {
    api.get('/api-n/notification/queryMessageCatergory', {}).then((res) => {
      console.log(res)
    })
  },
  delNotice(val) {
    console.log(val)
    let uid = val.currentTarget.dataset.uid
    let index = val.currentTarget.dataset.index
    api.get('/api-n/notification/deleteMessage', {
      uid: uid
    }).then((res) => {
      console.log(res)
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.tabSelect()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMessage()
    this.tabSelect()
    this.setData({
      TabCur: 0
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