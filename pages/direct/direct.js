  // pages/direct/direct.js
  //获取应用实例
  const app = getApp()
  import api from '../../api/api'
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      motto: 'Hello World',
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      navData: [{
          text: '全部',
          key: '',
          value: ''
        },
        {
          text: '现货',
          key: 'goods_type',
          value: true
        },
        {
          text: '订货',
          key: 'goods_type',
          value: false
        },
        {
          text: '原厂直供',
          key: 'create_tag',
          value: true
        },
        {
          text: '代理商',
          key: 'create_tag',
          value: false
        },
        {
          text: '特价商品',
          key: 'special_price',
          value: false
        },
        {
          text: '呆料清仓',
          key: 'is_old_product',
          value: true
        }
      ],
      currentTab: 0,
      navScrollLeft: 0,
      directList: {},
      silderOpen: false,
      // mark 是指原点x轴坐标
      mark: 0,
      // newmark 是指移动的最新点的x轴坐标 
      newmark: 0,
      istoright: true,
      detailObj: {},
      hotSaleList: [],
      factoryData: [],
      propertyList: [],
      goodsParams: {},
      tabParams: {},
      typeParanms: {}
    },
    // tab切换
    switchNav(event, val) {
      console.log(event, val, '88888888')
      var cur = event.currentTarget.dataset.current;
      //每个tab选项宽度占1/4
      var singleNavWidth = this.data.windowWidth / 4;
      //tab选项居中                            
      this.setData({
        navScrollLeft: (cur - 2) * singleNavWidth
      })
      if (this.data.currentTab == cur) {
        return false;
      } else {
        this.setData({
          currentTab: cur
        })
      }
      this.data.tabParams = {}
      if (event.currentTarget.dataset.item.text != '全部') {
        this.data.tabParams[event.currentTarget.dataset.item.key] = event.currentTarget.dataset.item.value
      }
      this.getSubGoods()
    },
    // 获取列表
    getSubGoods() {
      var obj = {}
      obj = Object.assign({}, this.data.tabParams, this.data.typeParanms, this.data.goodsParams)
      console.log('88888888888', this.data.tabParams, this.data.typeParanms, this.data.goodsParams, obj)
      api.post('/api-g/gods-anon/queryByProperty', obj).then(res => {
        console.log(res)
        if (res.data != null) {
          this.setData({
            hotSaleList: res.data.data
          })
        }
      })
    },
    //tab 宽度
    switchTab(event) {
      var cur = event.detail.current;
      var singleNavWidth = this.data.windowWidth / 4;
      this.setData({
        currentTab: cur,
        navScrollLeft: (cur - 2) * singleNavWidth
      });
    },
    // 筛选条件
    typeChoose(val) {
      console.log(val)
      this.data.typeParanms[val.currentTarget.dataset.item.propertyId] = val.currentTarget.dataset.item.childList[val.currentTarget.dataset.k]
      this.data.propertyList[val.currentTarget.dataset.index]['typeKey'] = val.currentTarget.dataset.k
      this.setData({
        propertyList: this.data.propertyList
      })
    },
    // 重置
    reset() {
      for (var i = 0; i < this.data.propertyList.length; i++) {
        if (this.data.propertyList[i].typeKey != undefined) {
          this.data.propertyList[i].typeKey = -1
        }
      }
      this.setData({
        typeParanms: {}
      })
      this.setData({
        propertyList: this.data.propertyList
      })
    },
    // 筛选确认
    confirm() {
      this.getSubGoods()
      this.data.mark = 0;
      this.data.newmark = 0;
      this.setData({
        silderOpen: false
      });
    },
    // 跳转商品详情
    toproductDetail(val) {
      console.log(val, this.data.brandList)
      this.data.detailObj['documentid'] = val.currentTarget.dataset.item.brandId
      this.data.detailObj['tag'] = 'goodsinfo'
      this.data.detailObj['name'] = val.currentTarget.dataset.item.productno
      this.setData({
        detailObj: this.data.detailObj
      })
      console.log(this.data.detailObj)
      let detailParams = JSON.stringify(this.data.detailObj)
      wx.navigateTo({
        url: '../productDetail/productDetail?params=' + detailParams,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    // 侧边栏是否显示
    tap_ch: function(e) {
      if (this.data.silderOpen) {
        this.setData({
          silderOpen: false
        });
      } else if (!this.data.silderOpen) {
        this.setData({
          silderOpen: true
        });
      }
    },


    tap_start: function(e) {
      // touchstart事件
      // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
      this.data.mark = this.data.newmark = e.touches[0].pageX;
    },
    tap_drag: function(e) {
      // touchmove事件
      this.data.newmark = e.touches[0].pageX;

      // 手指从左向右移动
      if (this.data.mark < this.data.newmark) {
        this.istoright = true;
      }

      // 手指从右向左移动
      if (this.data.mark > this.data.newmark) {
        this.istoright = false;
      }
      this.data.mark = this.data.newmark;
    },
    tap_end: function(e) {
      // touchend事件
      this.data.mark = 0;
      this.data.newmark = 0;
      // 通过改变 opne 的值，让主页加上滑动的样式
      // if (this.istoright) {
      //   this.setData({
      //     silderOpen: false
      //   });
      // } else {
      //   this.setData({
      //     silderOpen: true
      //   });
      // }
    },
    getGoodsAnon() {
      var goodsanonObj = {}
      if (this.data.directList.brandId) {
        goodsanonObj['brandId'] = this.data.directList.brandId
        goodsanonObj['catergoryId'] = this.data.directList.documentid
      } else {
        goodsanonObj['catergoryId'] = this.data.directList.documentid
      }
      api.get('/api-g/gods-anon/queryPropertyByParentId',
        goodsanonObj
      ).then(res => {
        console.log(res)
        if (res.data != null) {
          this.setData({
            factoryData: res.data.factory,
            propertyList: res.data.propertyList
          })
        }
      })
    },
    getsearchResult() {
      api.get('/api-g/gods-anon/searchResult', {
        start: 0,
        length: 10,
        tag: this.data.directList.tag,
        name: this.data.directList.name,
        id: this.data.directList.documentid,
      }).then(res => {
        console.log(res)
        if (res.data != null) {
          this.setData({
            hotSaleList: res.data.direct.data
          })
        }
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
      let brandIdInfo = {

      }
      if (this.data.directList.brandId) {
        brandIdInfo = {
          start: 0,
          length: 10,
          brand_id: this.data.directList.brandId,
          parent_id: this.data.directList.documentid
        }
      } else {
        brandIdInfo = {
          start: 0,
          length: 10,
          parent_id: this.data.directList.documentid
        }
      }
      this.setData({
        goodsParams: brandIdInfo
      })
      console.log(this.data.directList)


      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }


      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          this.setData({
            pixelRatio: res.pixelRatio,
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth
          })
        },
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

      this.getsearchResult()
      this.getGoodsAnon()
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