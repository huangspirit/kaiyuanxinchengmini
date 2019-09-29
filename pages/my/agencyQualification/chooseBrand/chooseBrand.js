// pages/my/agencyQualification/chooseBrand/chooseBrand.js
import api from '../../../../api/api'
import util from '../../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyData: [],
    brandData: [],
    searchBrand: [],
    keyWord: [
      "#", 'A', "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]
  },
  keySearch(e) {
    console.log(e)
    let keyWord = e.currentTarget.dataset.item
    this.brandSearch(keyWord)
  },
  brandSearch(e) {
    let keyWord = ""
    if (e.detail) {
      if (e.detail.value == "") {
        this.setData({
          searchBrand: []
        })
        return
      } else {
        keyWord = e.detail.value
      }
    } else {
      keyWord = e
    }
    api.get('/api-g/gods-anon/findBrand', {
      start: 0,
      length: 100,
      name: keyWord
    }).then((res) => {
      console.log(res)
      this.setData({
        searchBrand: res.data.data
      })
      for (let i = 0; i < this.data.searchBrand.length; i++) {
        this.data.searchBrand[i].nick_name = this.data.searchBrand[i].nick_name.replace('<font color="red">', "")
        this.data.searchBrand[i].nick_name = this.data.searchBrand[i].nick_name.replace('</font>', "")
        this.data.searchBrand[i]['nameLight'] = util.hilightWord(keyWord, this.data.searchBrand[i].nick_name)
      }
      this.setData({
        searchBrand: this.data.searchBrand,
      })
    })
  },
  confiemBrand(val) {
    console.log(val)
    let keyBrand = val.currentTarget.dataset.item.nick_name
    wx.setStorageSync('chooseBrand', keyBrand)
    wx.navigateTo({
      url: '../addEditAgency/addEditAgency',
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