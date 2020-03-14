// pages/editAdress/editAdress.js
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adressDetail: {
      address: ['北京市', '北京市', '东城区'],
      receivingName: "",
      phone: "",
      phoneAreaCode: "中国+0086",
      tel: "",
      telAreaCode: "010",
      postalCode: "",
      detailedAddress: "",
      isEnable: 1,
      isdefault:false
    },
    deleteShow: false
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.adressDetail.address = e.detail.value
    this.setData({
      adressDetail: this.data.adressDetail
    })
  },
  nameChange(e) {
    this.data.adressDetail.receivingName = e.detail.value
    this.setData({
      adressDetail: this.data.adressDetail
    })
  },
  phoneChange(e) {
    this.data.adressDetail.phone = e.detail.value
    this.setData({
      adressDetail: this.data.adressDetail
    })
  },
  telChange(e) {
    this.data.adressDetail.tel = e.detail.value
    this.setData({
      adressDetail: this.data.adressDetail
    })
  },
  adressChange(e) {
    this.data.adressDetail.detailedAddress = e.detail.value
    this.setData({
      adressDetail: this.data.adressDetail
    })
  },
  postalChange(e) {
    this.data.adressDetail.postalCode = e.detail.value
    this.setData({
      adressDetail: this.data.adressDetail
    })
  },
  SetShadow(val){
    console.log(val)
    this.setData({
      adressDetail:{
        ...this.data.adressDetail,
        isdefault: val.detail.value
      }
    })

  },
  confirm() {
    if (this.data.adressDetail.receivingName == '') {
      wx.showToast({
        title: '请输入收货人',
        icon: "none",
        duration: 1000
      })
      return
    }
    if (this.data.adressDetail.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: "none",
        duration: 1000
      })
      return
    }
    if (this.data.adressDetail.detailedAddress == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none",
        duration: 1000
      })
      return
    }
    this.data.adressDetail.address = this.data.adressDetail.address.join('/')
    if (this.data.adressDetail.id) {
      
      api.post('/api-u/address/updateReceivingAddress', this.data.adressDetail).then(res => {
        if (res.resultCode == '200') {
          wx.showToast({
            title: '成功',
            icon: "success",
            duration: 1000
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      api.post('/api-u/address/saveReceivingAddress', {...this.data.adressDetail}).then(res => {
        console.log('新增地址', res)
        if (res.resultCode == '200') {
          wx.showToast({
            title: '成功',
            icon: "success",
            duration: 1000
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
   
  },
  deleteAddress() {
    api.post('/api-u/address/deleteReceivingAddressById?id=' + this.data.adressDetail.id, {
      id: this.data.adressDetail.id
    }).then(res => {
      console.log('删除地址', res)
      if (res.resultCode == '200') {
        wx.showToast({
          title: '成功',
          icon: "success",
          duration: 1000
        })
        wx.navigateBack({
          delta:1
        })
        // wx.navigateTo({
        //   url: '../addressList/addressList',
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(wx.getStorageSync('editAdress'))
    console.log(options)
    if (wx.getStorageSync('editAdress')) {
      this.data.adressDetail = JSON.parse(wx.getStorageSync('editAdress'))
      this.data.adressDetail.address = this.data.adressDetail.address.split('/')
      this.setData({
        adressDetail: this.data.adressDetail,
        deleteShow: true
      })
    } else {
      this.setData({
        adressDetail: {
          address: ['北京市', '北京市', '东城区'],
          receivingName: "",
          phone: "",
          phoneAreaCode: "中国+0086",
          tel: "",
          telAreaCode: "010",
          postalCode: "",
          detailedAddress: "",
          isEnable: 1
        }
      })
    }
    console.log(this.data.adressDetail)
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