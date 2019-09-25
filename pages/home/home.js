// pages/home/home.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specialList: [],
    facdirect: [],
    material: [], //呆料
    brandTotal: 0,
    catergoryTotal: 0,
    productTotal: 0,
    indicatorDots: false,
    searchList: [],
    classList: [{
        img: "../../img/home/yuan.png",
        name: '原厂直供'
      },
      {
        img: "../../img/home/xianhuo.png",
        name: '现货特价'
      },
      {
        img: "../../img/home/dinghuo.png",
        name: '订货跟单'
      },
      {
        img: "../../img/home/dailiao.png",
        name: '呆料掘金'
      },
      {
        img: "../../img/home/zhendangqi.png",
        name: 'MEMS 振荡器'
      },
      {
        img: "../../img/home/chuanganqi.png",
        name: '传感器'
      },
      {
        img: "../../img/home/lianjieqi.png",
        name: '连接器'
      },
      {
        img: "../../img/home/geliqi.png",
        name: '隔离器'
      },
    ],
    calssIndex: 0,
    subClassList: [],
    directObj: {},

  },
  factoryDirect() {
    wx: wx.navigateTo({
      url: '../factoryDirect/factoryDirect',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  toSearch() {
    wx: wx.navigateTo({
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

  toDetail(val) {
    console.log(val)
    var obj = {}
    obj['documentid'] = val.currentTarget.dataset.item.goods_id
    obj['tag'] = 'goodsinfo'
    obj['name'] = val.currentTarget.dataset.item.goods_name
    var routerParams = JSON.stringify(obj)
    let storageItem = JSON.stringify(val.currentTarget.dataset.item)
    wx: wx.setStorageSync('productDetail', storageItem)
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?params=' + routerParams,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  classSearch() {
    // wx: wx.navigateTo({
    //   url: '../classSearch/classSearch',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    wx.switchTab({
      url: '../classCation/classCation',
    })
  },
  classList(val) {
    console.log(val)
    let index = val.currentTarget.dataset.index
    if (index == 0) {
      wx.navigateTo({
        url: '../factoryDirect/factoryDirect',
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: '../spotSpecial/spotSpecial',
      })
    } else if (index == 2) {
      wx.navigateTo({
        url: '../orderGoods/orderGoods',
      })
    } else if (index == 3) {
      wx.navigateTo({
        url: '../material/material',
      })
    } else {
      console.log(app)
      if (index == 4) {
        app.globalData.classType = 1
      } else if (index == 5) {
        app.globalData.classType = 4
      } else if (index == 6) {
        app.globalData.classType = 3
      } else if (index == 7) {
        app.globalData.classType = 2
      }

      wx.switchTab({
        url: '../classCation/classCation',
      })
    }

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
      length: 6,
      special_price: false,
      status: 1
    }).then(res => {
      console.log('特价直通车', res)
      if (res.resultCode == "200") {
        this.setData({
          specialList: res.data.data
        })
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
      }
    })
    //获取原厂直供
    api.get("/api-g/gods-anon/queryDirectGoods", {
      create_tag: true,
      status: 1,
      start: 0,
      length: 3
    }).then(res => {
      console.log('获取原厂直供列表', res)
      if (res.resultCode == "200") {
        this.setData({
          facdirect: res.data.data
        })
      }
    })

    //获取呆料掘金
    api.get("/api-g/gods-anon/queryDirectGoods", {
      start: 0,
      length: 100,
      is_old_product: true,
      status: 1
    }).then(res => {
      console.log('获取呆料掘金列表', res)
      if (res.resultCode == "200") {
        this.setData({
          material: res.data.data
        })
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
    var that = this;
    console.log('11')
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