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
    searchList: [],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }],
    classList: [],
    calssIndex: 0,
    subClassList: [],
    directObj: {}
  },
  specialSearch() {
    console.log('111')
    wx.switchTab({
      url: '../special/special',
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
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.towerSwiper('swiperList');
  },
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  getSubClassList(val) {
    console.log(val)
    var cateInfo = ""
    if (val.id) {
      cateInfo = val.id
    } else {
      cateInfo = val.currentTarget.dataset.item.id
      this.setData({
        calssIndex: val.currentTarget.dataset.index
      })
    }
    api.get("/api-g/gods-anon/queryCatergoryHomePage", {
      catergory_id: cateInfo,
      flag: false
    }).then(res => {
      if (res.resultCode == "200") {
        this.setData({
          subClassList: res.data
        })
        console.log(this.data.subClassList)
      }
    })

  },
  subClssRouter(val) {
    console.log(val)
    let directObj = {}
    this.data.directObj['brandId'] = null
    this.data.directObj['tag'] = 'direct'
    this.data.directObj['name'] = val.currentTarget.dataset.item.name
    this.data.directObj['documentid'] = val.currentTarget.dataset.item.id
    this.setData({
      directObj: this.data.directObj
    })
    let directParams = JSON.stringify(this.data.directObj)
    wx: wx.navigateTo({
      url: '../direct/direct?params=' + directParams,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //直通车正在售卖列表
    api.get("/api-g/gods-anon/queryDirectGoods", {
      start: 0,
      length: 6,
      special_price: false,
      status: 1
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
    api.get("/api-g/gods-anon/queryCatergoryHomePage", {
      catergory_id: 0,
      flag: true
    }).then(res => {
      console.log('获取分类列表', res)
      if (res.resultCode == '200') {
        this.setData({
          classList: res.data
        })
        this.getSubClassList(res.data[0])
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
        console.log(this.data.imgUrls)
      }
    })
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