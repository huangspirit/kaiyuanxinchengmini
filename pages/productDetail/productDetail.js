// pages/productDetail/productDetail.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productParams: "",
    productDetail: {},
    merchantsData: [],
    TabbarBot: app.globalData.tabbar_bottom,
  },
  getProductDetail() {
    api.get('/api-g/gods-anon/searchResult', {
      id: this.data.productParams.documentid,
      tag: this.data.productParams.tag,
      name: this.data.productParams.name
    }).then(res => {
      console.log('商品详情', res)
      if (res.resultCode == "200") {
        this.setData({
          productDetail: res.data.goodsinfo
        })
        api.get('/api-g/gods-anon/queryDirectGoods', {
          goods_id: this.data.productParams.documentid,
          status: '1',
          start: 0,
          length: 10
        }).then(res => {
          console.log('商品商户列表', res)
          if (res.resultCode == '200') {
            this.setData({
              merchantsData: res.data.data
            })
            console.log(this.data.merchantsData)
          }
        })
      }
    })
  },
  addFocus(val) {
    console.log(val)
    api.get('/api-g/gf/insertGoodsFavourite', {
      goods_id: val.currentTarget.dataset.item.id,
      catergory_id: val.currentTarget.dataset.item.classificationId,
      favour_type: "1"
    }).then(res => {
      console.log(res)
      if (res.resultCode == '200') {
        wx: wx.showToast({
          title: '关注成功',
          icon: 'success',
          image: '',
          duration: 800,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        this.getProductDetail()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let reqInfo = JSON.parse(options.params)
    this.setData({
      productParams: reqInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getProductDetail()
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