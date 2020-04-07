// pages/center/buyer/oneOrderDetail/oneOrderDetail.js
import api from '../../../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopNav:false,
    navH: app.globalData.navHeight,
    host: app.globalData.host,
    orderNo: "",
    orderDetail: {},
    processlist: [],
    express:[],
    countObj: {},
    canclereason: "",
    currentGoods: {},
    modalName: "",
    orderobj: {}
  },
  toBill(){
    wx.navigateTo({
      url: '/pages/center/buyer/invoiceManage/invoiceManage?orderno='+this.data.orderDetail.orderVo.order_no,
    })
  },
  downsys(val) {
    wx.showLoading({
      title: '下载中...',
    })
    var _this = this;
    wx.downloadFile({
      url: _this.data.host + "/api-order/customerCenter/downLoad?urls=" + val.currentTarget.dataset.item.contractUrl + "&access_token=" + wx.getStorageSync('token'),
      success: function(res) {
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function(res) {
            wx.hideLoading();
            _this.getdetail()
          }
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  downperson(val) {
    wx.showLoading({
      title: '下载中...',
    })
    var _this = this;
    wx.downloadFile({
      url: _this.data.host + "/api-order/customerCenter/downLoad?urls=" + val.currentTarget.dataset.item.customerContractUrl + "&access_token=" + wx.getStorageSync('token'),
      success: function(res) {
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function(res) {
            wx.hideLoading();
            _this.getdetail()
          }
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  uphetong(val) {
    var _this = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'pdf',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '正在上传,请稍等...',
        })
        const tempFilePaths = res.tempFiles;
        wx.uploadFile({
          url: _this.data.host + '/api-order/customerCenter/uploadOrderContract', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0].path,
          name: 'file',
          formData: {
            orderno: val.currentTarget.dataset.item.order_no,
            access_token: wx.getStorageSync('token')
          },
          success(res) {
            // const data = res.data
            wx.hideLoading()
            _this.getdetail()
          }
        })
      }
    })
  },
  pay(val) {
    api.get('/api-order/wechat/getWechatSamrtPay', {
      type: val.currentTarget.dataset.item.need_pre_pay?0:2,
      message_id: val.currentTarget.dataset.item.order_no
    }).then(respon => {
      if (respon.resultCode == '200') {
        this.setData({
          loadModal: false
        })
        wx.requestPayment({
          timeStamp: respon.data.timeStamp,
          nonceStr: respon.data.nonceStr,
          package: respon.data.package,
          signType: 'MD5',
          paySign: respon.data.paySign,
          'success': function (res) {
            console.log(res)
            this.getdetail()
          },
          'fail': function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  monthpay(val) {
    api.get("/api-order/customerCenter/vipPay", {
      orderNo: val.currentTarget.dataset.item.order_no,
      access_token: wx.getStorageSync('token')
    }).then(res => {
      wx.showToast({
        title: '已支付',
      })
      this.getdetail()
    })
  },
  getDelivery(e){
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
    api.get("/api-order/customerCenter/queryExpress",{
      orderId:e.currentTarget.dataset.item.id
    }).then(res=>{
        this.setData({
          express:res.data
        })
    })
  },
  showModal(e) {
    this.setData({
      canclereason: "",
      modalName: e.currentTarget.dataset.target,
      currentGoods: e.currentTarget.dataset.item
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  textareaAInput(e) {
    this.setData({
      canclereason: e.detail.value
    })
  },
  confirmCancelOrder() {
    if (!this.data.canclereason) {
      wx.showToast({
        title: '请填写取消的原因',
        icon: "none"
      })
      return;
    }
    let obj = {
      flag: true, //标识大订单
      orderId: this.data.orderDetail.orderVo.id,
      reason: this.data.canclereason
    }
    api.get("/api-order/customerCenter/cancelOrder", obj).then(res => {
      wx.showToast({
        title: '已取消',
      })
      this.setData({
        modalName: null
      })
      this.getdetail()
    })
  },
  confirmCancelGoods(val) {
    if (!this.data.canclereason) {
      wx.showToast({
        title: '请填写取消的原因',
        icon: "none"
      })
      return;
    }
    let obj = {
      flag: false, //标识小订单
      orderId: this.data.currentGoods.id,
      reason: this.data.canclereason
    }
    api.get("/api-order/customerCenter/cancelOrder", obj).then(res => {
      if (res.resultCode == "400") {
        wx.showToast({
          title: '取消此零件需要补交关税，请移驾官网操作',
        })
        this.setData({
          modalName: null
        })
      } else {
        wx.showToast({
          title: '已取消',
        })
        this.setData({
          modalName: null
        })
      }

      this.getdetail();

    })
  },
  rebuy(val) {
    api.get("/api-g/gods-anon/querySellerGoods", {
      id: val.currentTarget.dataset.item.goods_id
    }).then(res => {
      if ((res.resultCode = 200 && res.data != 0)) {
        wx.navigateTo({
          url: "/pages/productDetail/productDetail?tag=goodsinfo&id=" + val.currentTarget.dataset.item.goods_id + "&name=" + val.currentTarget.dataset.item.goods_name
        })
      } else {
        wx.showToast({
          title: '当前产品暂无卖家，不能购买',
          icon:"none"
        })
      }
    })
  },
  comment(){
    wx.showToast({
      title: '请移步官方网站评价',
      icon: "none"
    })
  },
  service(){
    wx.showToast({
      title: '请移步官方网站申请售后',
      icon: "none"
    })
  },
  confirmRecieveGoods(val){
    this.setData({
      currentGoods:val.currentTarget.dataset.item,
      modalName: "confirmRecieveGoods"
    })
  },
  ConfirmReceipt(){
    api.get("api-order/customerCenter/confirmRecieveGoods",{
      orderId:this.currentGoods.id
    }).then(res=>{
      this.setData({
        modalName:null
      })
      this.getdetail()
    })
  },
  payfinal(val){
    api.get('/api-order/wechat/getWechatSamrtPay', {
      type: 1,
      message_id: val.currentTarget.dataset.item.id
    }).then(respon => {
      if (respon.resultCode == '200') {
        this.setData({
          loadModal: false
        })
        wx.requestPayment({
          timeStamp: respon.data.timeStamp,
          nonceStr: respon.data.nonceStr,
          package: respon.data.package,
          signType: 'MD5',
          paySign: respon.data.paySign,
          'success': function (res) {
            this.getdetail()
          },
          'fail': function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  getdetail() {
    api.get("/api-order/customerCenter/queryOrderDeatil", {
      orderNo: this.data.orderNo
    }).then(res => {
      let count = {
        usdCount: 0,
        usd: 0,
        renCount: 0,
        ren: 0
      };
      let obj = {}
      res.data.data[0].orderInfoList.forEach(item => {
        if (item.order_status != 3) {
          if (item.priceunit) {
            count.usdCount++;
            count.usd += item.total_price;
          } else {
            count.renCount++;
            count.ren += item.total_price;
          }
        }
        if (obj[item.seller_id]) {
          obj.list.push(item)
        } else {
          obj[item.seller_id] = {
            list: [item],
            username: item.username,
            headImgUrl: item.headImgUrl
          }
        }
      });
      this.setData({
        orderDetail: res.data.data[0],
        countObj: count,
        orderobj: obj
      })
      this.getprocesslist()
    })
  },
  getprocesslist() {
    api.get("/api-order/customerCenter/queryOrderOperation", {
      orderno: this.data.orderNo
    }).then(res => {
      this.setData({
        processlist: res.data
      })
    })
  },
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  toHome() {
    this.setData({
      showTopNav:!this.data.showTopNav
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderNo: options.orderNo
    })
    this.getdetail();
    // this.getprocesslist()
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