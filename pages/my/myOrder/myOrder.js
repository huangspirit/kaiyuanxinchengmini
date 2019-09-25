// pages/my/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    navList: ['全部', '未发货', '已发货', '已逾期', '在售','已下架']
  },
  tabSelect(e) {
    if (e) {
      this.data.TabCur = e.currentTarget.dataset.id;
      this.setData({
        TabCur: this.data.TabCur
      })
    }
    if (this.data.TabCur == 0) {
      this.selectComponent("#allOrder").getAllOrder();
    }
    if (this.data.TabCur == 1) {
      this.selectComponent("#waitConfirm").getwaitConfirmOrder();
    }
    if (this.data.TabCur == 2) {
      this.selectComponent("#waitPay").getwaitPayOrder();
    }
    if (this.data.TabCur == 3) {
      this.selectComponent("#abnormalOrder").getabnormalOrder();
    }
    if (this.data.TabCur == 4) {
      this.selectComponent("#waitDelivery").getDeliveryOrder();
    }
    if (this.data.TabCur == 5) {
      this.selectComponent("#alredyEnd").getAlredyOrder();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.params == '0') {
      this.setData({
        TabCur: 1
      })

    } else if (options.params == '1') {
      this.setData({
        TabCur: 2
      })
    } else if (options.params == '2') {
      this.setData({
        TabCur: 4
      })
    } else if (options.params == '3') {
      this.setData({
        TabCur: 3
      })
    } else if (options.params == '4') {
      this.setData({
        TabCur: 0
      })
    } else if (options.params == '5') {
      this.setData({
        TabCur: 5
      })
    }
    this.tabSelect()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})