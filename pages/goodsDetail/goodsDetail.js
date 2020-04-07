// pages/productDetail/productDetail.js
import api from '../../api/api'
import utils from '../../utils/util.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopNav:false,
    navH:app.globalData.navHeight,
    baseURL3:app.globalData.baseURL3,
    showimgList:[],
    productDetail: {},
    specialData: {},
    priceLevel: [],
    // TabbarBot: app.globalData.tabbar_bottom,
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
      id: this.data.specialData.goods_id,
      tag: "goodsinfo",
      name: this.data.specialData.goods_name
    }).then(res => {
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
  downpdf() {
    wx.showLoading({
      title: '下载中...',
    })
    var _this = this;
    wx.downloadFile({
      url: _this.data.productDetail.datasheet,
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            wx.hideLoading()
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  toHome() {
    this.setData({
      showTopNav:!this.data.showTopNav
    })
  },
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  intoShopping(){
    if(this.data.specialData.tag==1){
      let obj={
        tag:'brand',
        id: this.data.specialData.brandId,
        name: this.data.specialData.brandName
      }
      wx: wx.navigateTo({
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
  inputNum(val) {
    let obj = {
      delbtnShow: false,
      addbtnShow: false,
    }
    let c = Number(val.detail.value);
    if (this.data.specialData.goodsCount < this.data.specialData.moq) {
      c = this.data.specialData.goodsCount
      obj.delbtnShow = true

    } else {
      if (c > this.data.specialData.goodsCount) {
        c = this.data.specialData.goodsCount;
        obj.addbtnShow = true

      } else if (c < this.data.specialData.moq) {
        c = this.data.specialData.moq
        obj.delbtnShow = true
      } else {
        let s = c % this.data.specialData.mpq;
        let ss = this.data.specialData.mpq / 2;
        if (s < ss) {
          c = c - s;
          obj.delbtnShow = false;
          obj.addbtnShow = false;
        } else {
          if ((c - s + this.data.specialData.mpq) > this.data.specialData.goodsCount) {
            c = this.data.specialData.goodsCount
            obj.delbtnShow = false;
            obj.addbtnShow = true;
          } else {
            c = c - s + this.data.specialData.mpq;
            obj.delbtnShow = false;
            obj.addbtnShow = false;
          }
        }
      }
    }
    let goodsnum = c;
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
    this.setData({
      purchaseObj:{
        ...this.data.purchaseObj,
        goodsNum: goodsnum,
        price: currentPrice,
        totalPrice: currentPrice * goodsnum,
        ...obj
      }
      
    })
  },
  addGoodsNum(e){
    let goodsNum = this.data.purchaseObj.goodsNum + this.data.specialData.mpq;
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
    let goodsNum = this.data.purchaseObj.goodsNum - this.data.specialData.mpq;
    let goodsnum = goodsNum <= this.data.specialData.moq?this.data.specialData.moq:goodsNum;
    let currentPrice = 0;
    if (this.data.specialData.priceType) {
      if (this.data.priceLevel.length == 1) {
        currentPrice = parseFloat(this.data.priceLevel[0].price);
      } else if (this.data.priceLevel.length == 2) {
        if (goodsnum <= Number(this.data.priceLevel[1].value)) {
          currentPrice = parseFloat(this.data.priceLevel[0].price);
        } else {
          currentPrice = parseFloat(this.data.priceLevel[1].price);
        }
      } else if (this.data.priceLevel.length == 3) {
        if (goodsnum <= Number(this.data.priceLevel[1].value)) {
          currentPrice = parseFloat(this.data.priceLevel[0].price);
        } else if (goodsnum <= Number(this.data.priceLevel[2].value)) {
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
  submitpurchase() {
    let item = this.data.specialData;
    let orderJson = [];
    let obj = {
      goods_id: item.goods_id,
      goodsDesc: item.goodsDesc,
      goodsImage: item.goodsImageUrl,
      goods_name: item.goods_name,
      diliver_place: item.diliverPlace,
      seckill_goods_id: item.id,
      clude_bill: item.includBill,
      price_unit: item.priceUnit,
      goods_type: item.goods_type,
      sellerName: item.sellerName,
      sellerHeader: item.userImgeUrl,
      seller_id: item.sellerId,
      tag: item.tag,
      goods_count: this.data.purchaseObj.goodsNum,
      goods_price: this.data.purchaseObj.price,
      order_channe: 1,
      pay_channe: 1,//微信转
    }
    orderJson.push(obj)
    console.log(obj)
    let billObj = {
      billtype: "1",
      content_id: "1"
    };
    // 生成bill对象
    let obj2 = {
      bill: JSON.stringify(billObj),
      dilivertype: "0",
      order: JSON.stringify(orderJson),
      add_id: 1,
      type: 0,
      orderSource: 1,
      togetherPay: false
    };
    api.post('/api-g/goods-b/orderCheck', obj2).then((res) => {
      wx.setStorageSync('buyOneGoodsDetail', JSON.stringify({
        data: JSON.stringify(res),
        obj2: JSON.stringify(obj2)
      }))
      wx.navigateTo({
        url: '../pay/pay',
      })
    })
  },
  // submitpurchase(){
  //   let item = this.data.specialData
  //   let orderJson = [];
  //   let obj = {
  //     goods_id: item.goods_id,
  //     goodsDesc: item.goodsDesc,
  //     goodsImage: item.goodsImage,
  //     goods_name: item.goods_name,
  //     diliver_place: item.diliver_place,
  //     seckill_goods_id: item.seckill_goods_id,
  //     clude_bill: item.clude_bill,
  //     price_unit: item.price_unit,
  //     goods_type: item.goods_type,
  //     sellerName: item.sellerName,
  //     sellerHeader: item.sellerHeader,
  //     seller_id: item.seller_id,
  //     tag: item.tag,
  //     goods_count: this.count,
  //     goods_price: this.price,
  //     order_channe: 1,
  //     pay_channe: 1,//微信转账
  //   }
  //   orderJson.push(obj)
  //   let billObj = {
  //     billtype: "1",
  //     content_id: "1"
  //   };
  //   // 生成bill对象
  //   let obj2 = {
  //     bill: JSON.stringify(billObj),
  //     dilivertype: "1",
  //     order: JSON.stringify(orderJson),
  //     add_id: 1,
  //     type: 0,
  //     orderSource: 1
  //   };
  // },
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
  getSellerGoodDetail(seller_goods_id){
    api.get('/api-g/gods-anon/queryDirectGoodsDetail', {
      length:1,
      seller_goods_id:seller_goods_id,
      start:0,
    }).then(res => {
      if (res.resultCode == "200") {
        let obj=res.data;
        if (obj.priceType) {
          let levelPrice = obj.priceLevel
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
        if (obj.sellerGoodsImageUrl) {
          let arr = [];
          arr = obj.sellerGoodsImageUrl.split("@").map(item => {
            return this.data.baseURL3 + "/" + item
          })
          this.setData({
            showimgList: arr
          })
        } else {
          this.setData({
            showimgList: [obj.goodsImageUrl]
          })
        }
        let time =obj.expireTime - obj.currentTime
        this.setCountDown(time)
        this.setData({
          specialData: obj,
        })
        this.getProductDetail()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    this.getSellerGoodDetail(options.seller_goods_id)
    // let reqInfo = JSON.parse(options.params)
    // console.log(reqInfo)
    // this.setData({
    //   productParams: reqInfo
    // })
    // let specialStorage = JSON.parse(wx.getStorageSync('productDetail'))
    // console.log(specialStorage)
    // if (specialStorage.priceType) {
    //   let levelPrice = specialStorage.priceLevel
    //       levelPrice = levelPrice.split('@')
    //       this.data.priceLevel = []
    //       for (let i = 0; i < levelPrice.length; i++) {
    //         let itemPrice = levelPrice[i].split('-')
    //         this.data.priceLevel.push({
    //           value: Number(itemPrice[0]),
    //           price: Number(itemPrice[1])
    //         })
    //       }
    //       this.setData({
    //         priceLevel: this.data.priceLevel
    //       })
    //     };
    // if (specialStorage.sellerGoodsImageUrl){
    //   let arr=[];
    //   arr=specialStorage.sellerGoodsImageUrl.split("@").map(item=>{
    //     return this.data.baseURL3+"/"+item
    //   })
    //   this.setData({
    //     showimgList: arr
    //   })
    // }else{
    //   this.setData({
    //     showimgList: [specialStorage.goodsImageUrl]
    //   })
    // }
    // this.setData({
    //   specialData: specialStorage
    // })
    // let time = this.data.specialData.expireTime - this.data.specialData.currentTime
    // this.setCountDown(time)
    // this.getProductDetail()
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