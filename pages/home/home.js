// pages/home/home.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH:0,
    start:0,
    length:10,
    total:0,
    baseURL3: app.globalData.baseURL3,
    title: app.globalData.title,
    errorImg: app.globalData.errorImg,
    specialList: [],
    classList: [{
      img: "../../img/home/home_icon1.png",
      name: '原厂直供'
    },
    {
      img: "../../img/home/home_icon2.png",
      name: '现货特价'
    },
    {
      img: "../../img/home/home_icon3.png",
      name: '订货跟单'
    },
    {
      img: "../../img/home/home_icon4.png",
      name: '呆料掘金'
    },
    {
      img: "../../img/home/home_icon5.png",
      name: 'MEMS振荡器'
    },
    {
      img: "../../img/home/home_icon6.png",
      name: '隔离器'
    },
    {
      img: "../../img/home/home_icon7.png",
      name: '传感器'
    },
    {
      img: "../../img/home/home_icon8.png",
      name: '被动元件'
    },
    ],
  },
  toSearch() {
    wx: wx.switchTab({
      url: '../search/search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
  },
  getGoodsList(isFirst){
    wx.showLoading({
      title: '加载中...',
    })
    api.get("/api-g/gods-anon/queryDirectGoods", {
      start: this.data.start,
      length: this.data.length,
      // special_price: false,
      status: 1
    }).then(res => {
      if (res.resultCode == "200") {
        let list=[];
        if(isFirst){
          list = res.data.data.map(item => {
            if (item.sellerGoodsImageUrl) {
              item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
            }
            return item;
          })
        }else{
          let arr = res.data.data.map(item => {
            if (item.sellerGoodsImageUrl) {
              item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
            }
            return item;
          })
          list = this.data.specialList.concat(arr)
        }
        this.setData({
          specialList:list,
          total:res.data.total
        })
        wx.hideLoading();
      }
    })
  },
  toDetail(val) {
    let item = val.currentTarget.dataset.item;
    // var obj = {}
    // obj['id'] = val.currentTarget.dataset.item.goods_id
    // obj['tag'] = 'goodsinfo'
    // obj['name'] = val.currentTarget.dataset.item.goods_name
    // var routerParams = JSON.stringify(obj)
    // console.log(routerParams)
    // let storageItem = JSON.stringify(val.currentTarget.dataset.item)
    // wx: wx.setStorageSync('productDetail', storageItem)
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?seller_goods_id=' + val.currentTarget.dataset.item.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  classSearch() {
    wx.switchTab({
      url: '../classCation/classCation',
    })
  },
  toClassList(val) {
    let index = val.currentTarget.dataset.index
    if (index == 0) {
      wx.navigateTo({
        // url: '../factoryDirect/factoryDirect',
        url: "../brandlist/brandlist"
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: '../spotSpecial/spotSpecial?tag=is_old_product&value=false&name=特价直通车',
      })
    } else if (index == 2) {
      wx.navigateTo({
        url: '../spotSpecial/spotSpecial?tag=goods_type&value=false&name=订货跟单',
      })
    } else if (index == 3) {
      wx.navigateTo({
        url: '../spotSpecial/spotSpecial?tag=is_old_product&value=true&name=呆料掘金池',
      })
    } else {
      let name = this.data.classList[index].name;
      api.get("/api-g/gods-anon/searchIndex", { name: name, length: 1, start: 0 }).then(res => {
        console.log(res.data.data[0])
        let obj = {
          name: res.data.data[0].name,
          id: res.data.data[0].documentid,
          tag: res.data.data[0].tag
        };
        wx: wx.navigateTo({
          url: '../undirect/undirect?params=' + JSON.stringify(obj),
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      })
    }

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
    this.getGoodsList()
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
    var that = this;
    console.log("顶部")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("底部")
    if(this.data.specialList.length<this.data.total){
        this.setData({
          start:this.data.start+this.data.length
        })
        this.getGoodsList(false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})