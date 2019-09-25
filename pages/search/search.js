// pages/search/search.js
const app = getApp()
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    textData: [],
    brandTotal: "",
    catergoryTotal: "",
    productTotal: "",
    specialList: []
  },
  search(val) {
    if (val.detail.value == '') {
      this.setData({
        searchList: [],
      })
    } else {
      api.get('/api-g/gods-anon/searchIndex', {
        name: val.detail.value,
        start: 0,
        length: 10
      }).then(res => {
        this.setData({
          searchList: res.data.data,
        })
        for (let i = 0; i < this.data.searchList.length; i++) {
          this.data.searchList[i].nick_name = this.data.searchList[i].nick_name.replace('<font color="red">', "")
          this.data.searchList[i].nick_name = this.data.searchList[i].nick_name.replace('</font>', "")
          this.data.searchList[i]['nameLight'] = this.hilight_word(val.detail.value, this.data.searchList[i].nick_name)
        }
        this.setData({
          searchList: this.data.searchList,
        })
      })
    }

  },
  // 根据搜索字分割字符
  hilight_word: function(key, word) {
    let idx = word.indexOf(key.toUpperCase()),
      t = [];
    if (idx > -1) {
      if (idx == 0) {
        t = this.hilight_word(key, word.substr(key.length));
        t.unshift({
          key: true,
          str: key
        });
        return t;
      }

      if (idx > 0) {
        t = this.hilight_word(key, word.substr(idx));
        t.unshift({
          key: false,
          str: word.substring(0, idx)
        });
        return t;
      }
    }
    return [{
      key: false,
      str: word
    }];
  },
  toDetail(val) {
    console.log(val, '555555')
    var tag = val.currentTarget.dataset['item']
    let obj = {}
    obj['documentid'] = tag.documentid
    obj['name'] = tag.name
    obj['tag'] = tag.tag
    if (tag.tag == 'brand') {
      obj = JSON.stringify(obj)
      wx: wx.navigateTo({
        url: '../brandDetail/brandDetail?brandList=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (tag.tag == 'direct') {
      obj['brandId'] = ''
      obj = JSON.stringify(obj)
      wx: wx.navigateTo({
        url: '../direct/direct?params=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (tag.tag == 'undirect') {

    } else if (tag.tag == 'goodsinfo') {
      obj = JSON.stringify(obj)
      wx: wx.navigateTo({
        url: '../productDetail/productDetail?params=' + obj,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 统计厂商产品总数的接口
    api.get("/api-g/gods-anon/querySummaryHome", {}).then(res => {

      this.setData({
        brandTotal: res.brandTotal,
        catergoryTotal: res.catergoryTotal,
        productTotal: res.productTotal,
        specialList: res.list
      })
    })
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