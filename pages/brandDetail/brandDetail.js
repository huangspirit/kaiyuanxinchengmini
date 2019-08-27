// pages/brandDetail/brandDetail.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandList: "",
    brandDetail: "",
    descHeight: true,
    descText: "查看更多",
    catetoryList: [],
    hotSaleList: [],
    detailObj: {},
    directObj: {},
    start: 0
  },
  descShow() {
    this.data.descHeight = !this.data.descHeight
    if (!this.data.descHeight) {
      this.setData({
        descText: '收起',
        descHeight: false
      })

    } else {
      this.setData({
        descText: '查看更多',
        descHeight: true
      })
    }
    console.log('222', this.data.descHeight, this.data.descText)
  },
  subCateList(val) {
    console.log(val, '1111')
    if (val.currentTarget.dataset.item.parentId) {
      let directObj = {}
      this.data.directObj['brandId'] = this.data.brandList.documentid
      this.data.directObj['tag'] = 'direct'
      this.data.directObj['name'] = val.currentTarget.dataset.item.catergoryName
      this.data.directObj['documentid'] = val.currentTarget.dataset.item.catergoryId
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
    } else {
      let obj = val.currentTarget.dataset.item
      api.get('/api-g/gods-anon/queryCatergoryByParentId', {
        firstCatergoryId: obj.catergoryId,
        brandId: this.data.brandList.documentid
      }).then(res => {
        console.log(res)
        this.setData({
          catetoryList: res.list
        })
      })
    }

  },
  toproductDetail(val) {
    console.log(val, this.data.brandList)
    this.data.detailObj['documentid'] = val.currentTarget.dataset.item.id
    this.data.detailObj['tag'] = 'goodsinfo'
    this.data.detailObj['name'] = val.currentTarget.dataset.item.productno
    this.setData({
      detailObj: this.data.detailObj
    })
    console.log(this.data.detailObj)
    let detailParams = JSON.stringify(this.data.detailObj)
    wx.navigateTo({
      url: '../productDetail/productDetail?params=' + detailParams,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let item = JSON.parse(options.brandList)
    console.log(item)
    this.setData({
      brandList: item
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    api.get('/api-g/gods-anon/searchResult', {
      id: this.data.brandList.documentid,
      tag: this.data.brandList.tag,
      name: this.data.brandList.name,
      start: this.data.start,
      length: 10
    }).then(res => {
      // console.log('品牌详情', res)
      if (res.resultCode == '200') {
        if (res.data.brand) {
          this.setData({
            brandDetail: res.data.brand,
          })
        }
        if (res.data.brand.childrenList) {
          this.setData({
            catetoryList: res.data.brand.childrenList
          })
        }
      }
    })
    api.get('/api-g/gods-anon/findGoodsBaseInfoAndExInfo', {
      type: '1',
      brandId: this.data.brandList.documentid,
      name: '',
      start: 0,
      length: 10
    }).then(res => {
      // console.log('品牌热卖', res)
      if (res.resultCode == '200') {
        this.setData({
          hotSaleList: res.data.data
        })
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
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      start: this.data.start + 10
    })

    api.get('/api-g/gods-anon/findGoodsBaseInfoAndExInfo', {
      type: '1',
      brandId: this.data.brandList.documentid,
      name: '',
      start: this.data.start,
      length: 10
    }).then(res => {

      if (res.resultCode == '200') {
        let getHotList = this.data.hotSaleList
        getHotList = getHotList.concat(res.data.data)
        // console.log('品牌热卖', getHotList)
        this.setData({
          hotSaleList: getHotList
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})