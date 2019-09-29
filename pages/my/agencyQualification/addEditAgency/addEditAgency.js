// pages/my/agencyQualification/addEditAgency/addEditAgency.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate: "2016-09-01",
    enddate: "2016-09-01",
    imgList: [],
    alredyChooseBrand: ""
  },
  startDateChange(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  endDateChange(e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  ChooseImage() {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        _this.data.imgList.push(tempFilePaths[0])
        _this.setData({
          imgList: _this.data.imgList
        })
        wx.uploadFile({
          url: 'https://api.113ic.com/api-b/vipApply/uploadPicture?access_token=' + wx.getStorageSync('token') + '&fileSource=QINIUYUN&type=5&id=1',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'access_token': wx.getStorageSync('token')
          },
          success: function(res) {
            console.log(res)
          }
        })
      }
    })
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgList: this.data.imgList
    })
  },
  chooseBrand() {
    wx.navigateTo({
      url: '../chooseBrand/chooseBrand',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      alredyChooseBrand: wx.getStorageSync('chooseBrand')
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