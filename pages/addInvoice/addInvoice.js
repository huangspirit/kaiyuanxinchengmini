// pages/addInvoice/addInvoice.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceDetail: {
      bankaccount: "",
      billcontent: 1,
      billno: "",
      billtiltle: "",
      billtype: 1,
      corporatename: "",
      isdefault: false,
      openingbank: "",
      registeredaddress: "",
      registeredphone: "",
    }
  },
  SetShadow(val) {
    this.setData({
      invoiceDetail: {
        ...this.data.invoiceDetail,
        isdefault:val.detail.value
        }
    })
  
  },
  corporatename(val) {
    console.log(val)
    this.data.invoiceDetail.corporatename = val.detail.value
    this.setData({
      invoiceDetail: this.data.invoiceDetail
    })
  },
  billno(val) {
    this.data.invoiceDetail.billno = val.detail.value
    this.setData({
      invoiceDetail: this.data.invoiceDetail
    })
  },
  bankaccount(val) {
    this.data.invoiceDetail.bankaccount = val.detail.value
    this.setData({
      invoiceDetail: this.data.invoiceDetail
    })
  },
  openingbank(val) {
    this.data.invoiceDetail.openingbank = val.detail.value
    this.setData({
      invoiceDetail: this.data.invoiceDetail
    })
  },
  registeredphone(val) {
    this.data.invoiceDetail.registeredphone = val.detail.value
    this.setData({
      invoiceDetail: this.data.invoiceDetail
    })
  },
  registeredaddress(val) {
    this.data.invoiceDetail.registeredaddress = val.detail.value
    this.setData({
      invoiceDetail: this.data.invoiceDetail
    })
  },
  confirm() {
    console.log(this.data.invoiceDetail)
    if (this.data.invoiceDetail.corporatename == '') {
      wx.showToast({
        title: '请输入公司名称',
      })
      return
    }
    if (this.data.invoiceDetail.billno == '') {
      wx.showToast({
        title: '请输入税号',
      })
      return
    }
    if (this.data.invoiceDetail.openingbank == '') {
      wx.showToast({
        title: '请输入开户银行',
      })
      return
    }
    if (this.data.invoiceDetail.bankaccount == '') {
      wx.showToast({
        title: '请输入银行账号',
      })
      return
    }
    if (this.data.invoiceDetail.registeredphone == '') {
      wx.showToast({
        title: '请输入开票电话',
      })
      return
    }
    if (this.data.invoiceDetail.registeredaddress == '') {
      wx.showToast({
        title: '请输入开票地址',
      })
      return
    }
    api.post('/api-u/userBill/insertUserBill', this.data.invoiceDetail).then((res) => {
      console.log(res)
      wx.navigateTo({
        url: '../invoiceType/invoiceType',
      })
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