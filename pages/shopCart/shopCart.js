// pages/shopCart/shopCart.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    allChecked: false,
    goodsAllPrice: 0,
    goodsAllNum: 0,
    goodsCount: 1,
    editgoodsShow: false,
    editText: '编辑商品',
    deleteId: "",
    catergoryId: "",
    goodsId: ""
  },
  changeAdress() {
    wx.showActionSheet({
      itemList: ['列1', '列2', '列3'], //显示的列表项
      success: function(res) { //res.tapIndex点击的列表项
        console.log("点击了列表项：")
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  getShopList() {
    api.get("/api-g/sc/queryShoppingCarList", {
      start: 0,
      length: 2,
      source: 1
    }).then(res => {

      if (res.resultCode == "200") {
        for (let k = 0; k < res.data.data.length; k++) {
          res.data.data[k]['checked'] = false
          for (let i = 0; i < res.data.data[k].list.length; i++) {
            res.data.data[k].list[i]['checked'] = false
            res.data.data[k].list[i]['goodsNum'] = res.data.data[k].list[i].moq
          }
        }
        this.setData({
          cartList: res.data.data
        })
        wx.stopPullDownRefresh();
        console.log('购物车', res.data.data)
      }
    })
  },
  editGoods() {
    this.data.editgoodsShow = !this.data.editgoodsShow
    for (let k = 0; k < this.data.cartList.length; k++) {
      this.data.cartList[k]['checked'] = false
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        this.data.cartList[k].list[i]['checked'] = false
      }
    }
    if (this.data.editgoodsShow) {
      this.data.editText = '完成'
    } else {
      this.data.editText = '编辑商品'
    }
    this.setData({
      editgoodsShow: this.data.editgoodsShow,
      cartList: this.data.cartList,
      allChecked: false,
      editText: this.data.editText,
      goodsAllPrice: 0,
      goodsAllNum: 0
    })
  },
  delete() {
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked && this.data.cartList[k].list[i].isenable) {
          console.log(this.data.cartList[k].list[i])
          this.data.deleteId = this.data.cartList[k].list[i].id
        }
      }
    }
    api.get("/api-g/sc/deleteSigletonShoppingCar", {
      id: this.data.deleteId
    }).then(res => {
      console.log(res)
      if (res.resultCode == "200") {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        this.editGoods()
        this.getShopList()
      }
    })
  },
  addFocus(val) {
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked && this.data.cartList[k].list[i].isenable) {
          console.log(this.data.cartList[k].list[i])
          this.data.catergoryId = this.data.cartList[k].list[i].catergoryId
          this.data.goodsId = this.data.cartList[k].list[i].goods_id
        }
      }
    }
    api.get('/api-g/gf/insertGoodsFavourite', {
      goods_id: this.data.catergoryId,
      catergory_id: this.data.goodsId,
      favour_type: "1"
    }).then(res => {
      console.log(res)
      if (res.resultCode == '200') {
        wx: wx.showToast({
          title: '收藏成功',
          icon: 'success',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        this.setData({
          allChecked: false
        })
        this.getShopList()
      }
    })
  },
  sonChecked(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    this.data.cartList[index].list[k].checked = !this.data.cartList[index].list[k].checked
    if (this.data.cartList[index].list[k].checked) {
      this.data.goodsAllPrice += this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
      this.data.goodsAllNum += this.data.cartList[index].list[k].goodsNum
    } else {
      this.data.goodsAllPrice -= this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
      this.data.goodsAllNum -= this.data.cartList[index].list[k].goodsNum
    }
    let subCheckedShow = true
    for (let k = 0; k < this.data.cartList[index].list.length; k++) {
      if (this.data.cartList[index].list[k].checked == false) {
        subCheckedShow = false
      }
    }
    if (subCheckedShow) {
      this.data.cartList[index].checked = true
    } else {
      this.data.cartList[index].checked = false
    }

    let allCheckedShow = true
    for (let k = 0; k < this.data.cartList.length; k++) {
      if (this.data.cartList[k].checked == false) {
        allCheckedShow = false
      }
    }
    if (allCheckedShow) {
      this.data.allChecked = true
    } else {
      this.data.allChecked = false
    }
    this.setData({
      cartList: this.data.cartList
    })
    this.setData({
      allChecked: this.data.allChecked
    })
    this.setData({
      goodsAllPrice: this.data.goodsAllPrice
    })
    this.setData({
      goodsAllNum: this.data.goodsAllNum
    })
  },


  subChecked(val) {
    let index = val.currentTarget.dataset.index
    this.data.cartList[index].checked = !this.data.cartList[index].checked
    if (this.data.cartList[index].checked == true) {
      for (let k = 0; k < this.data.cartList[index].list.length; k++) {
        this.data.cartList[index].list[k].checked = true
        this.data.goodsAllPrice += this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
        this.data.goodsAllNum += this.data.cartList[index].list[k].goodsNum
      }
    } else {
      for (let k = 0; k < this.data.cartList[index].list.length; k++) {
        this.data.cartList[index].list[k].checked = false
        this.data.goodsAllPrice -= this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
        this.data.goodsAllNum -= this.data.cartList[index].list[k].goodsNum
      }
    }

    let allCheckedShow = true
    for (let k = 0; k < this.data.cartList.length; k++) {
      if (this.data.cartList[k].checked == false) {
        allCheckedShow = false
      }
    }
    if (allCheckedShow) {
      this.data.allChecked = true
    } else {
      this.data.allChecked = false
    }
    console.log(this.data.cartList[index])
    this.setData({
      cartList: this.data.cartList
    })
    this.setData({
      allChecked: this.data.allChecked
    })
    this.setData({
      goodsAllPrice: this.data.goodsAllPrice
    })
    this.setData({
      goodsAllNum: this.data.goodsAllNum
    })
  },


  allChecked() {
    this.data.allChecked = !this.data.allChecked
    if (this.data.allChecked) {
      this.data.goodsAllPrice = 0
      for (let k = 0; k < this.data.cartList.length; k++) {
        this.data.cartList[k].checked = true
        for (let i = 0; i < this.data.cartList[k].list.length; i++) {
          this.data.cartList[k].list[i].checked = true
          this.data.goodsAllPrice += this.data.cartList[k].list[i].goodsNum * this.data.cartList[k].list[i].goodsPrice
          this.data.goodsAllNum += this.data.cartList[k].list[i].goodsNum
        }
      }
    } else {
      this.data.goodsAllPrice = 0
      this.data.goodsAllNum = 0
      for (let k = 0; k < this.data.cartList.length; k++) {
        this.data.cartList[k].checked = false
        for (let i = 0; i < this.data.cartList[k].list.length; i++) {
          this.data.cartList[k].list[i].checked = false
        }
      }
    }
    this.setData({
      cartList: this.data.cartList
    })
    this.setData({
      allChecked: this.data.allChecked
    })
    this.setData({
      goodsAllPrice: this.data.goodsAllPrice
    })
    this.setData({
      goodsAllNum: this.data.goodsAllNum
    })
  },

  addGoodsNum(val) {
    console.log(val)
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    this.data.goodsCount++
      this.data.cartList[index].list[k].goodsNum = this.data.cartList[index].list[k].moq * this.data.goodsCount
    this.setData({
      cartList: this.data.cartList
    })
  },
  delGoodsNum(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    this.data.goodsCount--
      if (this.data.goodsCount < 1) {
        this.data.goodsCount = 1
      }
    this.data.cartList[index].list[k].goodsNum = this.data.cartList[index].list[k].moq * this.data.goodsCount
    this.setData({
      cartList: this.data.cartList
    })
  },
  toPay() {

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
    this.getShopList()
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
    this.getShopList()
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