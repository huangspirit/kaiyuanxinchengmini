// pages/productDetail/productDetail.js
import api from '../../api/api'
import utils from '../../utils/util.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseURL3:app.globalData.baseURL3,
    showimgList:[],
    productParams: "",
    productDetail: {},
    specialData: {},
    priceLevel: [],
    TabbarBot: app.globalData.tabbar_bottom,
    timer: "",
    errorImg: app.globalData.errorImg,
    purchaseObj:{
      price:'',
      totalPrice:'',
      goodsNum:0,
      delbtnShow:true,
      addbtnShow:false
    }
  },
  getProductDetail() {
    api.get('/api-g/gods-anon/searchResult', {
      id: this.data.productParams.id,
      tag: this.data.productParams.tag,
      name: this.data.productParams.name
    }).then(res => {
      console.log('商品详情', res)
      if (res.resultCode == "200") {
        this.setData({
          productDetail: res.data.goodsinfo,
        })
        
      }
    })
  },
  addCart() {
    api.get('/api-g/sc/insertShoppingCar', {
      sellerId: this.data.specialData.sellerId,
      sellerGoodsId: this.data.specialData.id,
      goodsSource: 1,
      goodsName: this.data.specialData.goods_name,
      goodsId: this.data.specialData.goods_id
    }).then(res => {
      if (res.resultCode == "200") {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  addFocus(val) {
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
  onShareAppMessage: function(res) {

    if (res.from === 'button') {}
    return {
      title: '分享',
      path: '/pages/productDetail/productDetail',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  toHome() {
    wx: wx.switchTab({
      url: '../home/home',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  intoShopping(){
    if(this.data.specialData.tag==1){
      let obj={
        tag:'brand',
        id: this.data.specialData.brandId,
        name: this.data.specialData.brandName
      }
      wx: wx.redirectTo({
        url: '../orSeller/orSeller?params=' + JSON.stringify(obj),
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      console.log(this.data.specialData)
      wx: wx.redirectTo({
        url: '../agSeller/agSeller?seller_id=' + this.data.specialData.sellerId + '&name=' + this.data.specialData.sellerName,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  toCart() {
    wx: wx.switchTab({
      url: '../shopCart/shopCart',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  releaseSale() {
    wx.navigateTo({
      url: '../releaseSale/releaseSale?name=' + this.data.productDetail.productno
    })
  },
  purchase(e){
    let obj={};
    if (this.data.specialData.priceType){
        obj={
          price: this.data.priceLevel[0].price,
          totalPrice: Number(this.data.priceLevel[0].price) * this.data.specialData.moq,
          goodsNum: this.data.specialData.moq
        }
    }else{
      obj = {
        price: this.data.specialData.goodsPrice,
        totalPrice: this.data.specialData.goodsPrice * this.data.specialData.moq,
        goodsNum: this.data.specialData.moq
      }
    }
    this.setData({
      modalName: e.currentTarget.dataset.target,
      purchaseObj:{
        ...this.data.purchaseObj,
        ...obj
      }

    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  addGoodsNum(e){
    let goodsNum = this.data.purchaseObj.goodsNum + this.data.specialData.moq;
    let goodsnum = goodsNum > this.data.specialData.goodsStockCount ? this.data.specialData.goodsStockCount:goodsNum ;
    let currentPrice = 0;
    if (this.data.specialData.priceType) {
      if (this.data.priceLevel.length == 1) {
        currentPrice = parseFloat(this.data.priceLevel[0].price);
      } else if (this.data.priceLevel.length == 2) {
        if (goodsnum < Number(this.data.priceLevel[1].value)) {
          currentPrice = parseFloat(this.data.priceLevel[0].price);
        } else {
          currentPrice = parseFloat(this.data.priceLevel[1].price);
        }
      } else if (this.data.priceLevel.length == 3) {
        if (goodsnum < Number(this.data.priceLevel[1].value)) {
          currentPrice = parseFloat(this.data.priceLevel[0].price);
        } else if (goodsnum < Number(this.data.priceLevel[2].value)) {
          currentPrice = parseFloat(this.data.priceLevel[1].price);

        } else {
          currentPrice = parseFloat(this.data.priceLevel[2].price);
        }
      }
    } else {
      currentPrice = this.data.specialData.goodsPrice
    };
    if (goodsNum >= this.data.specialData.goodsStockCount){
      this.setData({
        purchaseObj: {
          ...this.data.purchaseObj,
          goodsNum: goodsnum,
          delbtnShow: false,
          addbtnShow: true,
          price:currentPrice,
          totalPrice:currentPrice*goodsnum
        }
      })
    }else{
      this.setData({
        purchaseObj: {
          ...this.data.purchaseObj,
          goodsNum: goodsnum,
          delbtnShow: false,
          price: currentPrice,
          totalPrice: currentPrice * goodsnum
        }
      })
    }
  },
  delGoodsNum(e) {
    let goodsNum = this.data.purchaseObj.goodsNum - this.data.specialData.moq;
    let goodsnum = goodsNum <= this.data.specialData.moq?this.data.specialData.moq:goodsNum;
    let currentPrice = 0;
    if (this.data.specialData.priceType) {
      if (this.data.priceLevel.length == 1) {
        currentPrice = parseFloat(this.data.priceLevel[0].price);
      } else if (this.data.priceLevel.length == 2) {
        if (goodsnum < Number(this.data.priceLevel[1].value)) {
          currentPrice = parseFloat(this.data.priceLevel[0].price);
        } else {
          currentPrice = parseFloat(this.data.priceLevel[1].price);
        }
      } else if (this.data.priceLevel.length == 3) {
        if (goodsnum < Number(this.data.priceLevel[1].value)) {
          currentPrice = parseFloat(this.data.priceLevel[0].price);
        } else if (goodsnum < Number(this.data.priceLevel[2].value)) {
          currentPrice = parseFloat(this.data.priceLevel[1].price);

        } else {
          currentPrice = parseFloat(this.data.priceLevel[2].price);
        }
      }
    }else{
      currentPrice = this.data.specialData.goodsPrice
    };
    if (goodsNum <= this.data.specialData.moq) {
      this.setData({
        purchaseObj:{
        ...this.data.purchaseObj,
        goodsNum: goodsnum,
        delbtnShow: true,
        addbtnShow:false,
        price: currentPrice,
        totalPrice: currentPrice * goodsnum}
      })
    }else{
      this.setData({
        purchaseObj: {
          ...this.data.purchaseObj,
          goodsNum: goodsnum,
          addbtnShow: false,
          price: currentPrice,
          totalPrice: currentPrice * goodsnum
        }
      })
    }
  },
  submitpurchase(){
    let item = this.data.specialData
    let orderJson = [];
    let obj = {
      goods_id: item.goods_id,
      goodsDesc: item.goodsDesc,
      goodsImage: item.goodsImage,
      goods_name: item.goods_name,
      diliver_place: item.diliver_place,
      seckill_goods_id: item.seckill_goods_id,
      clude_bill: item.clude_bill,
      price_unit: item.price_unit,
      goods_type: item.goods_type,
      sellerName: item.sellerName,
      sellerHeader: item.sellerHeader,
      seller_id: item.seller_id,
      tag: item.tag,
      goods_count: this.count,
      goods_price: this.price,
      order_channe: 1,
      pay_channe: 1,//微信转账
    }
    orderJson.push(obj)
    let billObj = {
      billtype: "1",
      content_id: "1"
    };
    // 生成bill对象
    let obj2 = {
      bill: JSON.stringify(billObj),
      dilivertype: "1",
      order: JSON.stringify(orderJson),
      add_id: 1,
      type: 0,
      orderSource: 1
    };
  },
  setCountDown(val) {
    let time = 1000

    if (val <= 0) {
      val = 0;
    }
    let formatTime = utils.getFormat(val);
    val -= time;
    this.data.specialData['countDown'] = formatTime;
    this.setData({
      specialData: this.data.specialData
    });
    this.data.timer = setTimeout(() => {
      this.setCountDown(val)
    }, time)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let reqInfo = JSON.parse(options.params)
    console.log(reqInfo)
    this.setData({
      productParams: reqInfo
    })
    let specialStorage = JSON.parse(wx.getStorageSync('productDetail'))
    if (specialStorage.priceType) {
      let levelPrice = specialStorage.priceLevel
          levelPrice = levelPrice.split('@')
          this.data.priceLevel = []
          for (let i = 0; i < levelPrice.length; i++) {
            let itemPrice = levelPrice[i].split('-')
            this.data.priceLevel.push({
              value: Number(itemPrice[0]),
              price: Number(itemPrice[1])
            })
          }
          this.setData({
            priceLevel: this.data.priceLevel
          })
        };
    if (specialStorage.sellerGoodsImageUrl){
      let arr=[];
      arr=specialStorage.sellerGoodsImageUrl.split("@").map(item=>{
        return this.data.baseURL3+"/"+item
      })
      this.setData({
        showimgList: arr
      })
    }else{
      this.setData({
        showimgList: [specialStorage.goodsImageUrl]
      })
    }
    this.setData({
      specialData: specialStorage
    })
    let time = this.data.specialData.expireTime - this.data.specialData.currentTime
    this.setCountDown(time)
    this.getProductDetail()
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
    clearTimeout(this.data.timer)
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