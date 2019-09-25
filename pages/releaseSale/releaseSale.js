// pages/releaseSale/releaseSale.js
import api from '../../api/api'
import dateTimePicker from '../../utils/dateTimePicker.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_type: 'true', //是否是现货
    clude_bill: 'true', //是否含税价
    diliverPlace: [],
    addressindex: 0,
    is_old_product: 'false', //是否是呆料
    price_type: 'true', //是否是阶梯价  出价方式
    seller_always: 'false', //售卖期限
    date: '2016-09-01',
    time: '12:01',
    dateTimeArray: null,
    startTimeArray: null,
    startTime: null,
    dateTime: null,
    startYear: 1970,
    endYear: 2100,
    imgList: []
  },
  RadioChange(e) {
    console.log(e)
    this.setData({
      goods_type: e.detail.value
    })
  },
  cludebillChange(e) {
    this.setData({
      clude_bill: e.detail.value
    })
  },
  isoldproductChange(e) {
    console.log(e)
    this.setData({
      is_old_product: e.detail.value
    })
  },
  pricetypeChange(e) {
    this.setData({
      price_type: e.detail.value
    })
  },
  selleralwaysChange(e) {
    this.setData({
      seller_always: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    console.log('picker下拉项发生变化后，下标为：', e.detail.value)
    this.setData({
      addressindex: e.detail.value
    })
  },
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },




  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },

  changestartTime(e) {
    this.setData({
      startTime: e.detail.value
    });
  },
  changestartTimeColumn(e) {
    var arr = this.data.startTime,
      dateArr = this.data.startTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      startTimeArray: dateArr,
      startTime: arr
    });
  },


  ChooseImage() {

  },
  getAdress() {
    api.get('/api-g/goods-b/queryDictionarieList', {
      distinguish: "3",
      isable: 1
    }).then((res) => {
      console.log(res)
      this.setData({
        diliverPlace: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAdress()
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      startTime: obj.dateTime,
      startTimeArray: obj.dateTimeArray
    });
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