// pages/home1/home1.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [{
      img: "../../img/home1/home_icon1.png",
      name: '原厂直供'
    },
    {
      img: "../../img/home1/home_icon2.png",
      name: '现货特价'
    },
    {
      img: "../../img/home1/home_icon3.png",
      name: '订货跟单'
    },
    {
      img: "../../img/home1/home_icon4.png",
      name: '呆料掘金'
    },
    {
      img: "../../img/home1/home_icon6.png",
      name: 'MEMS振荡器'
    },
      {
        img: "../../img/home1/home_icon6.png",
        name: '隔离器'
      },
    {
      img: "../../img/home1/home_icon7.png",
      name: '传感器'
    },
    {
      img: "../../img/home1/home_icon8.png",
      name: '被动元件'
    },
   
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
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