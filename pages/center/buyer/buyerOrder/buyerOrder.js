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
    timelist: [{
      name: "当天",
      day: 1,
    }, {
      name: "一周内",
      day: 7,
    }, {
      name: "1月内",
      day: 30,
    }, {
      name: "3月内",
      day: 90,
    }, {
      name: "半年内",
      day: 180,
    }, {
      name: "1年内",
      day: 365,
    }],
    currentday: '',
    typelist: [{
        type: "",
        name: '全部'
      },
      {
        type: "2",
        name: '待支付'
      },
      {
        type: "3",
        name: '待确认'
      },
      {
        type: "4",
        name: '待收货'
      },
      {
        type: "2.4",
        name: '月结'
      },
      {
        type: "6",
        name: '取消/异常'
      },
      {
        type: "5",
        name: '已完成'
      },
    ],
    type: "",
    currentPage: 1,
    pageSize: 5,
    total:0,
    orderlist:[],
    canclereason:"",
    currentOrder:{},
    modalName:null
  },
  todetail(val){
    console.log(val)
    wx.navigateTo({
      url: '/pages/center/buyer/oneOrderDetail/oneOrderDetail?orderNo=' + val.currentTarget.dataset.item.orderVo.order_no,
    })
  },
  downsys(val) {
    wx.showLoading({
      title: '下载中...',
    })
    var _this = this;
    wx.downloadFile({
      url: _this.data.host + "/api-order/customerCenter/downLoad?urls=" + val.currentTarget.dataset.item.contractUrl + "&access_token=" + wx.getStorageSync('token'),
      success: function (res) {
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            wx.hideLoading();
            _this.setData({
              currentPage: 1
            })
            _this.getorderlist()
          }
        })
      },
      fail: function (res) {
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
      success: function (res) {
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            wx.hideLoading();
            _this.setData({
              currentPage: 1
            })
            _this.getorderlist()
          }
        })
      },
      fail: function (res) {
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
            _this.setData({
              currentPage:1
            })
            _this.getorderlist()
          }
        })
      }
    })
  },
  pay(val) {
    api.get('/api-order/wechat/getWechatSamrtPay', {
      type: val.currentTarget.dataset.item.need_pre_pay ? 0 : 2,
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
            this.setData({
              currentPage:1
            })
            this.getorderlist()
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
      this.setData({
        currentPage:1
      })
      this.getorderlist()
    })
  },
  showModal(e) {
    this.setData({
      canclereason: "",
      modalName: e.currentTarget.dataset.target,
      currentOrder: e.currentTarget.dataset.item
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
  confirmCancel() {
    if (!this.data.canclereason) {
      wx.showToast({
        title: '请填写取消的原因',
        icon: "none"
      })
      return;
    }
    let obj = {
      flag: true, //标识大订单
      orderId: this.data.currentOrder.orderVo.id,
      reason: this.data.canclereason
    }
    api.get("/api-order/customerCenter/cancelOrder", obj).then(res => {
      wx.showToast({
        title: '已取消',
      })
      this.setData({
        modalName: null,
        currentPage:1
      })
      this.getorderlist()
    })
  },
  settime(val) {
    this.setData({
      currentday: val.currentTarget.dataset.day,
      currentPage: 1
    })
    this.getorderlist()
  },
  settype(val) {
    this.setData({
      type: val.currentTarget.dataset.type,
      currentPage: 1
    })
    this.getorderlist()
  },
  getorderlist() {
    wx.showLoading({
      title: '加载中...',
    })
    let obj = {
      type: this.data.type,
      day: this.data.currentday,
      start: (this.data.currentPage - 1) * this.data.pageSize,
      length: this.data.pageSize
    }
    api.get("/api-order/customerCenter/queryOrderPersonal",obj).then(res=>{
      let list=res.data.data.map(item=>{
        var ncount=0,
            rcount=0,
            ucount=0;
        item.orderInfoList.forEach(item0=>{
          if (item0.priceunit){
            ucount = ucount + item0.total_price
          }else{
            rcount = rcount + item0.total_price
          }
          ncount = ncount + item0.goods_count
        })
        return {...item,ncount,rcount,ucount}
      })
      if(this.data.currentPage==1){
        this.setData({
          total:res.data.total,
          orderlist:list
        })
        console.log(this.data.orderlist)
      }else{
        this.setData({
          orderlist:this.data.orderlist.concat(list)
        })
      }
    })
    wx.hideLoading()
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
      type: options.type == 0 ? '' : options.type
    })
    this.getorderlist()
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
    if(this.data.orderlist.length<this.data.total){
      this.setData({
        currentPage:this.data.currentPage+1
      })
      this.getorderlist();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})