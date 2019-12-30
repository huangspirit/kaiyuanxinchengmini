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
          name: '现货',
          tag:'goods_type',
          value:true
        },
        {
          name: '订货',
          tag:'goods_type',
          value:false
        },
        {
          name: '原厂直供',
          tag:"create_tag",
          value:true
        },
        {
          name: '代理商',
          tag:"create_tag",
          value:false
        },
        {
          name: '特价商品',
          tag:"special_price",
          value:true
        },
        {
          name: '呆料清仓',
          tag:"is_old_product",
          value:true
        }
      ],
      tabIndex: 0,
      start:0,
      length:10
    },
    // 跳转商品详情
    toproductDetail(val) {
      this.data.detailObj['id'] = val.currentTarget.dataset.item.id
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
    // getsearchResult() {
    //   this.setData({
    //     loadModal: true
    //   })
    //   api.get('/api-g/gods-anon/searchResult', {
    //     start: this.data.start,
    //     length: this.data.length,
    //     tag: this.data.directList.tag,
    //     name: this.data.directList.name,
    //     id: this.data.directList.id,
    //     flag:true
    //   }).then(res => {
    //     this.setData({
    //       loadModal: false
    //     })
    //     if (res.data != null) {
    //       this.setData({
    //         hotSaleList: res.data.direct.data
    //       })
          
    //     }
    //   })
    // },
    siderTab(val) {
      let obj={
        start: this.data.start,
        length: this.data.length,
        parent_id: this.data.directList.id,
      }
      if(val){
        this.setData({
          tabIndex: val.currentTarget.dataset.index,
          loadModal: true
        })
        obj[this.data.siderTab[val.currentTarget.dataset.index].tag] = this.data.siderTab[val.currentTarget.dataset.index].value
      }else{
        this.setData({
          tabIndex: 0,
          loadModal: true
        })
      }
       api.post('/api-g/gods-anon/queryByProperty', obj).then(res => {
          this.setData({
            loadModal: false
          })
          if (res.data != null) {
            this.setData({
              hotSaleList: res.data.data
            })
          }
        })
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
      let item = JSON.parse(options.params)
      this.setData({
        directList: item
      })
      wx.setNavigationBarTitle({
        title:item.name
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
      var that = this;
      // 显示加载图标
      this.setData({
        loadModal: true
      })
      this.setData({
        start: this.data.start + this.data.length
      });
      let obj = {
        start: this.data.start,
        length: this.data.length,
        parent_id: this.data.directList.id,
      }
      obj[this.data.siderTab[this.data.tabIndex].tag] = this.data.siderTab[this.data.tabIndex].value
      api.post('/api-g/gods-anon/queryByProperty', obj).then(res => {
        this.setData({
          loadModal: false
        })
        if (res.data != null) {
          let getHotList = this.data.hotSaleList
          getHotList = getHotList.concat(res.data.data)
          this.setData({
            hotSaleList: getHotList
          })
        }
      })  

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
  })