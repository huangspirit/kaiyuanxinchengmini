// pages/invoiceType/invoiceType.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceList: [],
    invoiceDetail: [],
    defaultInvoiceIndex:0,
    defaultInvoiceDetailIndex:0,
    routerInvoiceDetailIndex:-1,
    routerInvoiceIndex:-1

  },
  getInvoiceList() {
    api.get('/api-g/goods-b/queryGoodsBillSetOffList', {
      isenable: true,
      start: 0,
      length: 100
    }).then(res => {
      this.setData({
        invoiceList: res.data.data,
        //defaultInvoiceIndex:0
      })
    })
  },
  getinvoiceDetail() {
    api.get('/api-u/userBill/queryUserBill?', {
      start: 0,
      length: 100
    }).then(res => {
      let count=0;
      let defaultInvoiceDetailIndex =0
      let list=res.data.data.map((item,index)=>{
        if (item.isdefault){
          count=1;
          defaultInvoiceDetailIndex=index
        }
        return item;
      })
      
      if(this.data.routerInvoiceDetailIndex<0){
        this.setData({
          invoiceDetail: list,
          defaultInvoiceDetailIndex: defaultInvoiceDetailIndex
        })
      }else{
        this.setData({
          invoiceDetail: list,
          // defaultInvoiceDetailIndex: defaultInvoiceDetailIndex
        })
      }
    })
  },
  invoiceChange(val) {
    this.setData({
      defaultInvoiceIndex: val.currentTarget.dataset.index
    })
  },
  chooseInvoice(val) {
    this.setData({
      defaultInvoiceDetailIndex: val.currentTarget.dataset.index,
    })
  },
  addInvoice() {
    wx.navigateTo({
      url: '../addInvoice/addInvoice',
    })
  },
  confirm() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      defaultInvoiceIndex: this.data.defaultInvoiceIndex,
      defaultInvoiceDetailIndex: this.data.defaultInvoiceDetailIndex,
      isback:true
    })
    wx.navigateBack({
      delta:1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInvoiceList()
    this.getinvoiceDetail()
    if (options.defaultInvoiceDetailIndex){
      this.setData({
        defaultInvoiceDetailIndex: Number(options.defaultInvoiceDetailIndex),
        defaultInvoiceIndex: Number(options.defaultInvoiceIndex),
        routerInvoiceDetailIndex: Number(options.defaultInvoiceDetailIndex),
        routerInvoiceIndex: Number(options.defaultInvoiceIndex)
      })
    }
    // let obj = JSON.parse(wx.getStorageSync('buyOneGoodsDetail'))
    // this.setData({
    //   OrderInformation: JSON.parse(obj.obj2),
    //   payStorage: {
    //     data: JSON.parse(obj.data),
    //     obj2: JSON.parse(obj.obj2)
    //   }
    // })
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