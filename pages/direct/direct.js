  // pages/direct/direct.js
  //获取应用实例
  const app = getApp()
  import api from '../../api/api'
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      directList: {},
      detailObj: {},
      hotSaleList: [],
      loadModal: false,
      siderTab: [{
          name: '全部商品'
        },
        {
          name: '现货'
        },
        {
          name: '订货'
        },
        {
          name: '原厂直供'
        },
        {
          name: '代理商'
        },
        {
          name: '特价商品'
        },
        {
          name: '呆料清仓'
        }
      ],
      tabIndex: 0
    },
    // 跳转商品详情
    toproductDetail(val) {
      console.log(val, this.data.brandList)
      this.data.detailObj['documentid'] = val.currentTarget.dataset.item.id
      this.data.detailObj['tag'] = 'goodsinfo'
      this.data.detailObj['name'] = val.currentTarget.dataset.item.productno
      this.setData({
        detailObj: this.data.detailObj
      })
      var detailParams = JSON.stringify(this.data.detailObj)
      wx.navigateTo({
        url: '../productDetail/productDetail?params=' + detailParams,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    getsearchResult() {
      this.setData({
        loadModal: true
      })
      api.get('/api-g/gods-anon/searchResult', {
        start: 0,
        length: 10,
        tag: this.data.directList.tag,
        name: this.data.directList.name,
        id: this.data.directList.documentid,
        flag:true
      }).then(res => {
        console.log(res)
        this.setData({
          loadModal: false
        })
        if (res.data != null) {
          this.setData({
            hotSaleList: res.data.direct.data
          })
          wx.setNavigationBarTitle({
            title: res.data.parentName
          })
        }
      })
    },
    siderTab(val) {
      console.log(val)
      var index = 0
      if (val) {
        index = val.currentTarget.dataset.index
      } else {
        console.log('11', this.data.directList.index)
        if (this.data.directList.index) {
          console.log('22')
          index = this.data.directList.index + 2
        } else {
          console.log('333')
          index = 0
        }
      }
      this.setData({
        tabIndex: index
      })
      this.setData({
        loadModal: true
      })
      console.log(index)
      if (index == 0) {
        this.getsearchResult()
      } else if (index == 1) {
        api.post('/api-g/gods-anon/queryByProperty', {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid,
          goods_type: true
        }).then(res => {
          console.log(res)
          this.setData({
            loadModal: false
          })
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
      } else if (index == 2) {
        api.post('/api-g/gods-anon/queryByProperty', {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid,
          goods_type: false
        }).then(res => {
          this.setData({
            loadModal: false
          })
          console.log(res)
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
      } else if (index == 3) {
        api.post('/api-g/gods-anon/queryByProperty', {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid,
          create_tag: true
        }).then(res => {
          console.log(res)
          this.setData({
            loadModal: false
          })
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
      } else if (index == 4) {
        api.post('/api-g/gods-anon/queryByProperty', {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid,
          create_tag: false
        }).then(res => {
          console.log(res)
          this.setData({
            loadModal: false
          })
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
      } else if (index == 5) {
        api.post('/api-g/gods-anon/queryByProperty', {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid,
          special_price: false
        }).then(res => {
          console.log(res)
          this.setData({
            loadModal: false
          })
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
      } else if (index == 6) {

        api.post('/api-g/gods-anon/queryByProperty', {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid,
          is_old_product: true
        }).then(res => {
          console.log(res)
          this.setData({
            loadModal: false
          })
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
      }
    },
    toSearch() {
      wx: wx.navigateTo({
        url: '../search/search',
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
      let item = JSON.parse(options.params)
      this.setData({
        directList: item
      })
      this.siderTab()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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