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
    goodsAlltypePrice: 0,
    goodsAllNum: 0,
    editgoodsShow: false,
    editText: '编辑商品',
    deleteId: "",
    catergoryId: "",
    goodsId: "",
    sendData: {},
    adressList: [],
    addressindex: 0,
    payBtnShow: false,
    errorImg:app.globalData.errorImg
  },
  bindPickerChange: function(e) {
    this.setData({
      addressindex: e.detail.value
    })
    let address = JSON.stringify(this.data.adressList[e.detail.value])
    wx.setStorageSync('chooseAddress', address)
  },
  getAdress() {
    api.get("/api-u/address/queryAllReceivingAddress", {
      start: 0,
      length: 100
    }).then(res => {
      if (res.data != null) {
        this.setData({
          adressList: res.data.data
        })
        for (let i = 0; i < this.data.adressList.length; i++) {
          if (this.data.adressList[i].isdefault) {
            let address = JSON.stringify(this.data.adressList[i])
            wx.setStorageSync('chooseAddress', address)
          } else {
            let address = JSON.stringify(this.data.adressList[0])
            wx.setStorageSync('chooseAddress', address)
          }
        }
      } else {
        this.setData({
          adressList: []
        })
      }

    })
  },
  getShopList() {
    api.get("/api-g/sc/queryShoppingCarList", {
      start: 0,
      length: 100,
      source: 1
    }).then(res => {

      if (res.resultCode == "200") {
        
        for (let k = 0; k < res.data.data.length; k++) {
          res.data.data[k]['checked'] = false
          res.data.data[k]['isenable'] = false
          var subisenable = false
          for (let i = 0; i < res.data.data[k].list.length; i++) {
            res.data.data[k].list[i]['checked'] = false
            res.data.data[k].list[i]['goodsNum'] = res.data.data[k].list[i].moq
            res.data.data[k].list[i]['delbtnShow'] = true
            res.data.data[k].list[i]['addbtnShow'] = false
            res.data.data[k].list[i]['goodsCount'] = 1
            if (res.data.data[k].list[i].isenable) {
              res.data.data[k]['isenable'] = true
            }
          }
        }
        for (var k = 0; k < res.data.data.length; k++) {
          for (var i = 0; i < res.data.data[k].list.length; i++) {
            if (res.data.data[k].list[i].priceType) {
              var price = res.data.data[k].list[i].priceLevel
              var priceLength = price.split('@').length - 1
              res.data.data[k].list[i]['minPrice'] = price.split('@')[priceLength].split('-')[1]
            } else {

            }
          }
        }

        this.setData({
          cartList: res.data.data,
          goodsAllPrice: 0,
          goodsAllNum: 0,
          goodsAlltypePrice: 0,
          allChecked: false
        })
        wx.stopPullDownRefresh();
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
      goodsAllNum: 0,
      goodsAlltypePrice: 0
    })
  },
  delete() {
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked) {
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
      if (this.data.cartList[index].list[k].priceType) {
        this.data.goodsAllPrice += this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].minPrice
      } else {
        this.data.goodsAllPrice += this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
      }
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
      this.data.goodsAllNum += this.data.cartList[index].list[k].goodsNum
    } else {
      if (this.data.cartList[index].list[k].priceType) {
        this.data.goodsAllPrice -= this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].minPrice
      } else {
        this.data.goodsAllPrice -= this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
      }
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
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
      cartList: this.data.cartList,
      allChecked: this.data.allChecked,
      goodsAllPrice: this.data.goodsAllPrice,
      goodsAllNum: this.data.goodsAllNum,
      goodsAlltypePrice: this.data.goodsAlltypePrice
    })
    this.payBtn()
  },


  subChecked(val) {
    let index = val.currentTarget.dataset.index
    this.data.cartList[index].checked = !this.data.cartList[index].checked
    if (this.data.cartList[index].checked == true) {
      for (let k = 0; k < this.data.cartList[index].list.length; k++) {
        this.data.cartList[index].list[k].checked = true
        if (this.data.cartList[index].list[k].priceType) {
          this.data.goodsAllPrice += this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].minPrice

        } else {
          this.data.goodsAllPrice += this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice

        }
        this.data.goodsAllNum += this.data.cartList[index].list[k].goodsNum
      }
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
    } else {
      for (let k = 0; k < this.data.cartList[index].list.length; k++) {
        this.data.cartList[index].list[k].checked = false
        if (this.data.cartList[index].list[k].priceType) {
          this.data.goodsAllPrice -= this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].minPrice
        } else {
          this.data.goodsAllPrice -= this.data.cartList[index].list[k].goodsNum * this.data.cartList[index].list[k].goodsPrice
        }
        this.data.goodsAllNum -= this.data.cartList[index].list[k].goodsNum
      }
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
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
      cartList: this.data.cartList,
      allChecked: this.data.allChecked,
      goodsAllPrice: this.data.goodsAllPrice,
      goodsAllNum: this.data.goodsAllNum,
      goodsAlltypePrice: this.data.goodsAlltypePrice
    })
    this.payBtn()
  },


  allChecked() {
    this.data.allChecked = !this.data.allChecked
    if (this.data.allChecked) {
      this.data.goodsAllPrice = 0
      for (let k = 0; k < this.data.cartList.length; k++) {
        this.data.cartList[k].checked = true
        for (let i = 0; i < this.data.cartList[k].list.length; i++) {
          this.data.cartList[k].list[i].checked = true
          if (this.data.cartList[k].list[i].priceType) {
            this.data.goodsAllPrice += this.data.cartList[k].list[i].goodsNum * this.data.cartList[k].list[i].minPrice
          } else {
            this.data.goodsAllPrice += this.data.cartList[k].list[i].goodsNum * this.data.cartList[k].list[i].goodsPrice
          }
          this.data.goodsAllNum += this.data.cartList[k].list[i].goodsNum
        }
      }
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
    } else {
      this.data.goodsAllPrice = 0
      this.data.goodsAllNum = 0
      this.data.goodsAlltypePrice = 0
      for (let k = 0; k < this.data.cartList.length; k++) {
        this.data.cartList[k].checked = false
        for (let i = 0; i < this.data.cartList[k].list.length; i++) {
          this.data.cartList[k].list[i].checked = false
        }
      }
    }
    this.setData({
      cartList: this.data.cartList,
      allChecked: this.data.allChecked,
      goodsAllPrice: this.data.goodsAllPrice,
      goodsAllNum: this.data.goodsAllNum,
      goodsAlltypePrice: this.data.goodsAlltypePrice
    })
    this.payBtn()
  },
  payBtn() {
    let payShow = false
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked == true) {
          payShow = true
        }
      }
    }
    if (payShow) {
      this.data.payBtnShow = true
    } else {
      this.data.payBtnShow = false
    }
    this.setData({
      payBtnShow: this.data.payBtnShow
    })
  },
  addGoodsNum(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    console.log(this.data.cartList[index].list[k], val)
    this.data.cartList[index].list[k].goodsCount++
      this.data.cartList[index].list[k].goodsNum = this.data.cartList[index].list[k].moq * this.data.cartList[index].list[k].goodsCount
    if (this.data.cartList[index].list[k].goodsNum >= this.data.cartList[index].list[k].goodsStockCount) {
      this.data.cartList[index].list[k].addbtnShow = true
      this.data.cartList[index].list[k].delbtnShow = false
    } else if (this.data.cartList[index].list[k].goodsNum <= this.data.cartList[index].list[k].moq) {
      this.data.cartList[index].list[k].addbtnShow = false
      this.data.cartList[index].list[k].delbtnShow = true
    } else {
      this.data.cartList[index].list[k].addbtnShow = false
      this.data.cartList[index].list[k].delbtnShow = false
    }
    if (this.data.cartList[index].list[k].checked) {
      if (this.data.cartList[index].list[k].priceType) {
        this.data.goodsAllPrice += this.data.cartList[index].list[k].moq * this.data.cartList[index].list[k].minPrice
      } else {
        this.data.goodsAllPrice += this.data.cartList[index].list[k].moq * this.data.cartList[index].list[k].goodsPrice
      }
      this.data.goodsAllNum += this.data.cartList[index].list[k].moq
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
      this.setData({
        goodsAllNum: this.data.goodsAllNum,
        goodsAlltypePrice: this.data.goodsAlltypePrice
      })
    }
    this.setData({
      cartList: this.data.cartList
    })
  },
  delGoodsNum(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    this.data.cartList[index].list[k].goodsCount--
      this.data.cartList[index].list[k].goodsNum = this.data.cartList[index].list[k].moq * this.data.cartList[index].list[k].goodsCount
    if (this.data.cartList[index].list[k].goodsNum >= this.data.cartList[index].list[k].goodsStockCount) {
      this.data.cartList[index].list[k].addbtnShow = true
      this.data.cartList[index].list[k].delbtnShow = false
    } else if (this.data.cartList[index].list[k].goodsNum <= this.data.cartList[index].list[k].moq) {
      this.data.cartList[index].list[k].addbtnShow = false
      this.data.cartList[index].list[k].delbtnShow = true
    } else {
      this.data.cartList[index].list[k].addbtnShow = false
      this.data.cartList[index].list[k].delbtnShow = false
    }
    if (this.data.cartList[index].list[k].checked) {
      if (this.data.cartList[index].list[k].priceType) {
        this.data.goodsAllPrice -= this.data.cartList[index].list[k].moq * this.data.cartList[index].list[k].minPrice
      } else {
        this.data.goodsAllPrice -= this.data.cartList[index].list[k].moq * this.data.cartList[index].list[k].goodsPrice
      }
      this.data.goodsAllNum -= this.data.cartList[index].list[k].moq
      this.data.goodsAlltypePrice = this.data.goodsAllPrice.toFixed(2)
      this.setData({
        goodsAllNum: this.data.goodsAllNum,
        goodsAlltypePrice: this.data.goodsAlltypePrice
      })
    }
    this.setData({
      cartList: this.data.cartList
    })
  },
  toPay() {
    if (this.data.adressList.length <= 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
    }
    console.log(this.data.cartList)
    //去结算
    let orderJson = [];
    //计算有多少个美元产品
    let count = 0
    this.data.cartList.forEach(item0 => {
      item0.list.forEach(item => {
        if (item.checked && item.isenable) {
          if (item.priceUnit) {
            count++;
          }
          let obj = {
            seckill_goods_id: item.seller_goods_id,
            goods_id: item.goods_id,
            goods_name: item.goods_name,
            goods_count: item.goodsNum,
            goods_price: item.goodsPrice * item.moq,
            order_channe: 1,
            clude_bill: item.includBill,
            pay_channe: 1,
            price_unit: item.priceUnit,
            goods_type: item.goods_type,
            sellerName: item0.sellerName,
            sellerHeader: item0.sellerUrl,
            seller_id: item0.sellerId,
            tag: item0.sellerTag,
            goodsDesc: item.goodsDesc,
            goodsImage: item.goodsImageUrl,
            diliver_place: item.diliverPlace
          };
          if (!item.goods_type) {
            //标识期货
            obj = {
              ...obj,
              complete_date: item.deliverTime,
              diliver_date: item.deliverTime,
              end_date: item.endTime
            };
          }
          orderJson.push(obj);
        }
      });
    });
    if (orderJson.length < 1) {
      wx.showToast({
        title: '请选择商品',
      })
    }
    let billObj = {
      billtype: "1",
      content_id: "1"
    };
    // 生成bill对象
    this.data.sendData = {
      bill: JSON.stringify(billObj),
      dilivertype: "1",
      order: JSON.stringify(orderJson),
      add_id: 1,
      type: 0,
      orderSource: 1
    };
    if (count > 1) {
      //用户确认报关方式
      this.declareTypeCount = count;
      this.showDeclareType = true;
      this.declareType = true;
    } else {
      this.data.sendData['payWay'] = false
      api.post('/api-g/goods-b/orderCheck', this.data.sendData).then((res) => {
        console.log(res)
        wx.setStorageSync('buyOneGoodsDetail', JSON.stringify({
          data: JSON.stringify(res),
          obj2: JSON.stringify(this.data.sendData)
        }))
        wx.navigateTo({
          url: '../pay/pay',
        })
      })
    }

    // api.get('/api-order/wechat/getWechatSamrtPay', { message_id: 'JY-74201909161391', type:0}).then((res) => {
    //   console.log(res)
    // })
    
  },
  tohome() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  addAdress() {
    wx.navigateTo({
      url: '../editAdress/editAdress',
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
    this.getShopList()
    this.getAdress()
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