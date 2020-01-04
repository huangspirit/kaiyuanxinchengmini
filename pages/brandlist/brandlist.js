// pages/brandlist/brandlist.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasjoin:[],
    china:[],
    brandlist:[]
  },
  getbrandlist(){
    api.get("/api-g/gods-anon/queryBrandHomePage").then(res=>{
      let arr = [];
      if (res.data.china.brandPicture[true]){
        arr = arr.concat(res.data.china.brandPicture[true])
      }
      if (res.data.base.brandPicture[true]){
        arr = arr.concat(res.data.base.brandPicture[true])
      }
        this.setData({
          hasjoin: arr,
          china: Object.values(res.data.china.result1),
          brandlist: res.data.base.result1
        })
        
    })
  },
  toDetail(val){
    console.log(val)
    let item = val.currentTarget.dataset.item;
    wx:wx.navigateTo({
      url: '../orSeller/orSeller?params='+JSON.stringify({
        id:item.id,
        tag:'brand',
        name: item.brand
      }),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbrandlist()
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