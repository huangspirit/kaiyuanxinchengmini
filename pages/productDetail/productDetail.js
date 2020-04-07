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
    defaultAct:1,
    UserInforma:{},
    productParams: "",
    productDetail: {},
    TabbarBot: app.globalData.tabbar_bottom,
    specialList: [],
    currentPage:1,
    pageSize:6,
    total:0,
    countTimeData: [],
    timer: "",
    errorImg:app.globalData.errorImg,
    loadModal: false,
    timerCount:0,
    modalName:'',
    priceLevel:[],
    purchaseObj:{},
    specialData:{},
    count:0,
    price:0
  },
  goback(){
    wx.navigateBack({
      delta:1
    })
  },
  setdefaultAct(val){
    console.log(val.currentTarget.dataset.defaulta)
    this.setData({
      defaultAct: Number(val.currentTarget.dataset.defaulta)
    })
    console.log(this.data)
  },
  showdiag(){
    this.dialog.show()
  },
  popupCancel() {
    this.dialog.hide()
  },
  popupConfirm() { },
  downpdf(){
    wx.showLoading({
      title: '下载中...',
    })
    var _this=this;
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
  getSpecialList(isFirst){
    //器件售卖商家列表
    api.get("/api-g/gods-anon/queryDirectGoods2", {
      start: this.data.pageSize * (this.data.currentPage - 1),
      length: this.data.pageSize,
      goods_id: this.data.productDetail.id,
      status: 1
    }).then(res => {
      if (res.resultCode == "200") {
        clearTimeout(this.data.timer);
        this.setData({
          loadModal: false,
          total: res.data.total
        })
        if(isFirst){
          if (res.data.total) {
            this.setData({
              defaultAct: 1
            })
          } else {
            this.setData({
              defaultAct: 2
            })
          }
        }
        
        if (res.data.data.length > 0) {
          let specialList = res.data.data.map(item => {
            if (item.expireTime) {
              let countdownTime = item.expireTime - item.currentTime;
              item.remainTime = countdownTime;
              item.countDown = "";
            }
            return item;
          })
          if (isFirst) {
            this.setData({
              specialList: specialList
            })
          }else{
            this.setData({
              specialList: this.data.specialList.concat(specialList),
            })
          }
        }
        this.setCountDown()
      }
    })
  },
  getProductDetail() {
    this.setData({
      loadModal:true
    })
    api.get('/api-g/gods-anon/searchResult', {
      id: this.data.productParams.id,
      tag: this.data.productParams.tag,
      name: this.data.productParams.name
    }).then(res => {
      if (res.resultCode == "200") {
        this.setData({
          productDetail: res.data.goodsinfo,
        })
        this.getSpecialList(true)
      }
    })
  },
  setCountDown() {
    var _this=this;
    let time = 1000
    let specialList = this.data.specialList;
    let count=0;
    let list = specialList.map((v, i) => {
      if (!v.remainTime || v.remainTime <= 0) {
        v.remainTime = 0;
      }else{
        count=count+1
      }
      let formatTime = utils.getFormat(v.remainTime);
      v.remainTime -= time;
      v.countDown = formatTime;
      return v;
    })
   if(count==0){
     return;
   }
    this.setData({
      specialList: list,
      timer: setTimeout(() => {
        _this.setCountDown()
      }, time)
    });
  },
  addFocus(val) {
    api.get('/api-g/gf/insertGoodsFavourite', {
      goods_id: val.currentTarget.dataset.item.id,
      catergory_id: val.currentTarget.dataset.item.classificationId,
      favour_type: "1"
    }).then(res => {
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
        api.get('/api-g/gods-anon/searchResult', {
          id: this.data.productParams.id,
          tag: this.data.productParams.tag,
          name: this.data.productParams.name
        }).then(res => {
          if (res.resultCode == "200") {
            this.setData({
              productDetail: res.data.goodsinfo,
            })
          }
        })
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
  toCart() {
    wx: wx.switchTab({
      url: '../shopCart/shopCart',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toseller(val){
    let item = val.currentTarget.dataset.item;
    if (item.tag == 1) {
      let obj = {
        tag: 'brand',
        id: item.brandId,
        name: item.brandName
      }
      wx: wx.navigateTo({
        url: '../orSeller/orSeller?params=' + JSON.stringify(obj),
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx: wx.navigateTo({
        url: '../agSeller/agSeller?seller_id=' + item.sellerId + '&name=' + item.sellerName,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  releaseSale() {
    wx.navigateTo({
      url: '../releaseSale/releaseSale?name=' + this.data.productDetail.productno
    })
  },
  purchase(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      modalName:e.currentTarget.dataset.target,
      specialData:item
    })
    console.log(item)
    let obj = {};
    if (item.priceType) {
      let levelPrice = item.priceLevel;
      let arr=[]
      levelPrice = levelPrice.split('@')
      this.data.priceLevel = []
      for (let i = 0; i < levelPrice.length; i++) {
        let itemPrice = levelPrice[i].split('-')
        arr.push({
          value: Number(itemPrice[0]),
          price: Number(itemPrice[1])
        })
      }
      this.setData({
        priceLevel: arr
      })
      obj = {
        price: arr[0].price,
        totalPrice: Number(arr[0].price) * item.moq,
        goodsNum: item.moq
      }
    } else {
      obj = {
        price: item.goodsPrice,
        totalPrice: item.goodsPrice * item.moq,
        goodsNum: item.moq
      }
    }
    this.setData({
      modalName: e.currentTarget.dataset.target,
      purchaseObj: {
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
    let obj={
      delbtnShow: false,
      addbtnShow: false,
    }
    let c = Number(val.detail.value);
    if (this.data.specialData.goodsCount < this.data.specialData.moq) {
      c = this.data.specialData.goodsCount
      obj.delbtnShow=true
      
    } else {
      if (c > this.data.specialData.goodsCount) {
        c = this.data.specialData.goodsCount;
        obj.addbtnShow=true
        
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
  addGoodsNum(e) {
    let goodsNum = this.data.purchaseObj.goodsNum + this.data.specialData.mpq;
    let goodsnum = goodsNum > this.data.specialData.goodsStockCount ? this.data.specialData.goodsStockCount : goodsNum;
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
    if (goodsNum >= this.data.specialData.goodsStockCount) {
      this.setData({
        purchaseObj: {
          ...this.data.purchaseObj,
          goodsNum: goodsnum,
          delbtnShow: false,
          addbtnShow: true,
          price: currentPrice,
          totalPrice: currentPrice * goodsnum
        }
      })
    } else {
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
    let goodsnum = goodsNum <= this.data.specialData.moq ? this.data.specialData.moq : goodsNum;
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
    if (goodsNum <= this.data.specialData.moq) {
      this.setData({
        purchaseObj: {
          ...this.data.purchaseObj,
          goodsNum: goodsnum,
          delbtnShow: true,
          addbtnShow: false,
          price: currentPrice,
          totalPrice: currentPrice * goodsnum
        }
      })
    } else {
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
      pay_channe: 1,//微信转账
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
      togetherPay:false
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
  toDetail(val) {
    var currentItem = this.data.specialList[val.currentTarget.dataset.index];
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?seller_goods_id=' + currentItem.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let reqInfo = JSON.parse(options.params)
    let UserInforma = JSON.parse(wx.getStorageSync('UserInforma'))
    this.setData({
      productParams: reqInfo,
      navH:app.globalData.navHeight,
      UserInforma: UserInforma
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getProductDetail();
    this.dialog = this.selectComponent('#dialog')
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
    if(this.data.defaultAct==1){
      if (this.data.currentPage * this.data.pageSize==this.data.total){
        this.setData({
          currentPage:this.data.currentPage+1
        })
        this.getSpecialList(false)
      }else{
        wx.showToast({
          title: '已全部加载',
          duration: 1000,
          icon:"none"
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') { }
    return {
      title: this.data.productParams.name,
      imageUrl:this.data.productDetail.imageUrl,
      path: "pages/productDetail/productDetail?params= {'id': " + this.data.productParams.id+ ",'tag':'goodsinfo','name':" + this.data.productParams.name+"}",
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})