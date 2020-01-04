  // pages/direct/direct.js
  //获取应用实例
  const app = getApp()
  import api from '../../api/api'
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      UserInforma: {},
      directList: {},
      detailObj: {},
      hotSaleList: [],
      total:0,
      byName: false,
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
      length:10,
      errorImg: app.globalData.errorImg,
      name:"",
      join:false
    },
    //加入询价蓝
    addInquiry(val) {
      val = val.currentTarget.dataset.item
      var obj = {
        sellerGoodsId: val.id,
        goodsId: val.id,
        sellerId: val.brandId,
        goodsSource: "2",
        goodsName: val.productno
      };
      api.get("/api-g/sc/insertShoppingCar", obj).then(res => {
        if (res.resultCode == "200") {
          wx.showToast({
            title: '已加入询价篮',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //商家发布特价若未入驻
    pushlishspecialPrice(val) {
      val = val.currentTarget.dataset.item;
      let UserInforma = JSON.parse(this.data.UserInforma)
      if (UserInforma.userTagMap.seller) {
        wx: wx.navigateTo({
          url: '../releaseSale/releaseSale?name=' + val.productno,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        this.setData({
          join: true
        })
        this.dialog.show()
      }
    },
    //申请特价
    specialPrice() {
      this.setData({
        join: false
      })
      this.dialog.show()
    },
    popupCancel() {
      this.dialog.hide()
    },
    popupConfirm() { },
    focus(val) {
      let index = val.currentTarget.dataset.index
      val = val.currentTarget.dataset.item;
      console.log(index)
      let obj = {
        goods_id: val.id,
        catergory_id: val.classificationId,
        favour_type: "1",
      };

      api.get("/api-g/gf/insertGoodsFavourite", obj).then(res => {
        console.log(res)
        if (res.resultCode == 200) {
          wx.showToast({
            title: '已关注',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            hotSaleList: this.data.hotSaleList.map((item, index0) => {
              if (index == index0) {
                item.focus = true;
              }
              return item;
            })
          })
        }

      })
    },
    //跳转到品牌
    toBrand(val) {
      let item = val.currentTarget.dataset.item;
      let obj = {
        tag: "brand",
        id: item.brandId,
        name: item.brand
      }
      wx: wx.navigateTo({
        url: '../orSeller/orSeller?params=' + JSON.stringify(obj),
      })
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
    siderTab(val) {
      if (val) {
        this.setData({
          tabIndex: val.currentTarget.dataset.index,
          start: 0,
          byName:false
        })
      } else {
        this.setData({
          tabIndex: 0,
          start: 0,
          byName: false
        })
      }
     this.getgoodslistByitem()
    },
    getgoodslistByName(){
      this.setData({
        loadModal: true
      })
      let obj = {
        start: this.data.start,
        length: this.data.length,
        parent_id: this.data.directList.id,
        type:3
      }
      if (this.data.name) {
        obj.name = this.data.name
      }
      if (this.data.directList.brandId) {
        obj.brandId = this.data.directList.brandId
      }
      api.get('/api-g/gods-anon/findGoodsBaseInfoAndExInfo', obj).then(res => {
        this.setData({
          loadModal: false,
          total: res.data.total
        })
        if (res.data != null) {
          this.setData({
            hotSaleList: res.data.data,
          })
        } else {
          this.setData({
            hotSaleList: []
          })
        }
      })
    },
    getgoodslistByitem(){
      this.setData({
        loadModal: true
      })
      let obj = {
        start: this.data.start,
        length: this.data.length,
        parent_id: this.data.directList.id,
      }
      if (this.data.directList.brandId) {
        obj.brand_id = this.data.directList.brandId
      }
      obj[this.data.siderTab[this.data.tabIndex].tag] = this.data.siderTab[this.data.tabIndex].value
      api.post('/api-g/gods-anon/queryByProperty', obj).then(res => {
        this.setData({
          loadModal: false,
          total: res.data.total
        })
        if (res.data != null) {
          this.setData({
            hotSaleList: res.data.data,
          })
        } else {
          this.setData({
            hotSaleList: []
          })
        }
      })
    },
    toSearch(val) {
      this.setData({
        name: val.detail.value,
        start:0,
        byName:true
      })
     this.getgoodslistByName();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
  console.log(options)
      let UserInforma = wx.getStorageSync('UserInforma')
      let item = JSON.parse(options.params)
      this.setData({
        directList: item,
        UserInforma: UserInforma
      })
      wx.setNavigationBarTitle({
        title:item.name
      })
      this.siderTab()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
      this.dialog = this.selectComponent('#dialog')
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
      if (this.data.total > this.data.start + this.data.length) {
        this.setData({
          start: this.data.start + this.data.length
        })
        if(this.data.byName){
          this.getgoodslistByName()
        }else{
          this.getgoodslistByitem();
        }
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
  })