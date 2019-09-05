// pages/home/myFocus/myFocus.js
import api from '../../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    focusList: [],
    goodsNum: 0,
    editShow: false,
    editText: "编辑商品",
    allShow: false,
    editmerShow: false,
    merchanText: "编辑商品",
    deleteGoodsId: ""
  },
  //swiper切换时会调用
  pagechange: function(e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
      console.log('66666', this.data.currentIndex)
    }
  },
  //用户点击tab时调用
  titleClick: function(e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  getFocusGoods() {
    api.get("/api-g/gf/queryGoodsFavouriteList", {
      start: 0,
      length: 1000,
      favour_type: 1
    }).then(res => {

      if (res.resultCode == "200") {
        this.data.focusList = res.data.list.data
        this.data.focusList['checked'] = false
        this.data.goodsNum = res.data.list.total
        this.setData({
          focusList: this.data.focusList,
          goodsNum: this.data.goodsNum
        })
        console.log('关注商品', res.data.list)
      }
    })
  },
  getFocusMerchans() {
    api.get("/api-g/gf/queryGoodsFavouriteList", {
      start: 0,
      length: 2,
      favour_type: 2
    }).then(res => {
      if (res.resultCode == "200") {

        console.log('关注商家', res.data.list)
      }
    })
  },
  subChecked(val) {
    console.log(val)
    let index = val.currentTarget.dataset.index
    this.data.focusList[index].checked = !this.data.focusList[index].checked
    let allShow = true
    for (let i = 0; i < this.data.focusList.length; i++) {
      if (this.data.focusList[i].checked == false) {
        allShow = false
      }
    }
    if (allShow) {
      this.data.allShow = true
    } else {
      this.data.allShow = false
    }
    this.setData({
      focusList: this.data.focusList,
      allShow: this.data.allShow
    })
  },
  allChecked() {

    this.data.allShow = !this.data.allShow
    if (this.data.allShow) {
      for (let i = 0; i < this.data.focusList.length; i++) {
        this.data.focusList[i].checked = true
      }
    } else {
      for (let i = 0; i < this.data.focusList.length; i++) {
        this.data.focusList[i].checked = false
      }
    }
    this.setData({
      focusList: this.data.focusList,
      allShow: this.data.allShow
    })
  },
  editGoods() {
    this.data.editShow = !this.data.editShow
    if (this.data.editShow) {
      this.setData({
        editText: '完成'
      })
    } else {
      this.setData({
        editText: '编辑商品'
      })
    }
    this.setData({
      editShow: this.data.editShow
    })
  },
  merchanEdit() {
    this.data.editmerShow = !this.data.editmerShow
    if (this.data.merchanText) {
      this.setData({
        merchanText: '完成'
      })
    } else {
      this.setData({
        merchanText: '编辑商品'
      })
    }
    this.setData({
      editmerShow: this.data.editmerShow
    })
  },
  deteleFoucs() {
    for (let i = 0; i < this.data.focusList.length; i++) {
      if (this.data.focusList[i].checked) {
        console.log(this.data.focusList[i])
        this.data.deleteGoodsId = this.data.focusList[i].id
      }
    }
    api.get("/api-g/gf/deleteGoodsFavourite", {
      id: this.data.deleteGoodsId
    }).then(res => {
      if (res.resultCode == "200") {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          image: '',
          duration: 1000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        this.getFocusGoods()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.params == '1') {
      this.setData({
        currentIndex: 0
      })
    } else {
      this.setData({
        currentIndex: 1
      })
    }
    this.getFocusGoods()
    this.getFocusMerchans()
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