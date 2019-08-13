// pages/home/home.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specialList: [],
    brandTotal: 0,
    catergoryTotal: 0,
    productTotal: 0,
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,
    searchList:[],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    productList: [{
      name: '电阻',
      textColor: "#5CCFB6",
      bacgroundColor: "#EBFDFD"
    }, {
      name: '晶体管',
      textColor: "#A068EA",
      bacgroundColor: "#F6ECFE"
    }, {
      name: '二极管',
      textColor: "#A1D5A4",
      bacgroundColor: "#F0FDF2"
    }, {
      name: '晶振',
      textColor: "#C04067",
      bacgroundColor: "#FEF0F5"
    }, {
      name: '放大镜/…',
      textColor: "#E38264",
      bacgroundColor: "#FEF0F5"
    }, {
      name: '电源芯片',
      textColor: "#5CCFB6",
      bacgroundColor: "#EBFDFD"
    }, {
      name: '电感/磁珠',
      textColor: "#FFC11F",
      bacgroundColor: "#FFF8EB"
    }, {
      name: '存储器',
      textColor: "#DE693F",
      bacgroundColor: "#FDF0E9"
    }, ]
  },
  specialSearch() {
    console.log('111')
    wx.switchTab({
      url: '../special/special',
    })
  },
  toSearch() {
    wx:wx.navigateTo({
      url: '../search/search',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
    //直通车正在售卖列表
    api.get("/api-g/gods-anon/queryDirectGoods", {
      start: 0,
      length: 20
    }).then(res => {
      if (res.resultCode == "200") {
        this.setData({
          specialList: res.data.data
        })
        console.log(this.data.specialList)
      }
    })
    // 统计厂商产品总数的接口
    api.get("/api-g/gods-anon/querySummaryHome", {}).then(res => {

      this.setData({
        brandTotal: res.brandTotal,
        catergoryTotal: res.catergoryTotal,
        productTotal: res.productTotal
      })
      if (res.resultCode == "200") {
        this.setData({
          specialList: res.data.data
        })
        console.log(this.data.specialList)
      }
    })
    //获取分类列表
    api.get("/api-g/gods-anon/queryBrandHomePage", {}).then(res => {
      console.log('获取分类列表', res)
      // this.setData({
      //   brandTotal: res.brandTotal,
      //   catergoryTotal: res.catergoryTotal,
      //   productTotal: res.productTotal
      // })
      // if (res.resultCode == "200") {
      //   this.setData({
      //     specialList: res.data.data
      //   })
      //   console.log(this.data.specialList)
      // }
    })
    //获取品牌列表
    api.get("/api-g/gods-anon/findBrand", {
      type: "",
      name: "",
      start: 0,
      length: 1000
    }).then(res => {
      console.log('获取品牌列表', res)
      if (res.resultCode == "200") {
        this.setData({
          imgUrls: res.data.data
        })
        console.log(this.data.imgUrls)
      }
    })
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