//获取应用实例
const app = getApp()
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserInforma:{},
    params: {},
    detailObj: {},
    hotSaleList: [],
    loadModal: false,
    total:0,
    start: 0,
    length: 10,
    params:{},
    categorylist:[],
    showCover: false,
    siderIndex: 0,
    join:false,
    name:''
  },
  //加入询价蓝
  addInquiry(val){
    val=val.currentTarget.dataset.item
    var obj = {
      sellerGoodsId: val.id,
      goodsId: val.id,
      sellerId: val.brandId,
      goodsSource: "2",
      goodsName: val.productno
    };
    api.get("/api-g/sc/insertShoppingCar",obj).then(res=>{
      if(res.resultCode=="200"){
        wx.showToast({
          title: '已加入询价篮',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  //商家发布特价若未入驻
  pushlishspecialPrice(val){
    val = val.currentTarget.dataset.item;
    let UserInforma = JSON.parse(this.data.UserInforma)
    if (UserInforma.userTagMap.seller){
      wx: wx.navigateTo({
        url: '../releaseSale/releaseSale?name=' + val.productno,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      this.setData({
        join:true
      })
      this.dialog.show()
    }
  },
  //申请特价
  specialPrice(){
    this.setData({
      join: false
    })
    this.dialog.show()
  },
  popupCancel() {
    this.dialog.hide()
  },
  popupConfirm(){},
  focus(val){
    let index = val.currentTarget.dataset.index
    val = val.currentTarget.dataset.item;
    console.log(index)
    let obj = {
      goods_id:val.id,
      catergory_id: val.classificationId,
      favour_type: "1",
    };
    
    api.get("/api-g/gf/insertGoodsFavourite",obj).then(res=>{
      console.log(res)
      if(res.resultCode==200){
        wx.showToast({
          title: '已关注',
          icon:'success',
          duration:2000
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
  showCoverTap() {
    this.setData({
      showCover: true
    })
  },
  hideCoverTap() {
    this.setData({
      showCover: false
    })
  },
  siderChange(val) {
    let obj={
      id: val.currentTarget.dataset.item.catergoryId,
      name: val.currentTarget.dataset.item.catergoryName
    }
    if(this.data.params.brandId){
      obj.brandId = this.data.params.brandId
    }
    wx: wx.navigateTo({
      url: '../direct/direct?params=' + JSON.stringify(obj),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //跳转到品牌
  toBrand(val){
    let item = val.currentTarget.dataset.item;
    let obj={
      tag:"brand",
      id: item.brandId,
      name:item.brand
    }
    wx:wx.navigateTo({
      url: '../orSeller/orSeller?params='+JSON.stringify(obj),
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
  getcategorylist(){
      if(this.data.params.brandId){
        api.get("/api-g/gods-anon/queryCatergoryByParentId",{
          brandId:this.data.params.brandId,
          firstCatergoryId: this.data.params.id
        }).then(res=>{
          this.setData({
            categorylist: res.list,
          })
        })
      }else{
        api.get("/api-g/gods-anon/searchResult",{...this.data.params}).then(res=>{
          this.setData({
            categorylist:res.data.undirect.list,
            
          })
        })
      }
  },
  getgoodslist(isFirst){
    this.setData({
      loadModal: true
    })
    let obj={
      start: isFirst?0:this.data.start,
      length: this.data.length,
      first_id:this.data.params.id,
      type:2
    }
    if (this.data.params.brandId){
      obj.brandId = this.data.params.brandId
    }
    if(this.data.name){
      obj.name=this.data.name
    }
    api.get("/api-g/gods-anon/findGoodsBaseInfoAndExInfo",obj).then(res=>{
      this.setData({
        loadModal: false,
        total:res.data.total
      })
      if (res.data != null) {
        if (isFirst){
          this.setData({
            hotSaleList: res.data.data,
            start: this.data.length
          })
        }else{
          let getHotList = this.data.hotSaleList
          getHotList = getHotList.concat(res.data.data)
          this.setData({
            hotSaleList: getHotList,
            start: this.data.start + this.data.length
          })
        }
      }
    })
  },
  toSearch(val) {
    this.setData({
      name:val.detail.value
    })
    this.getgoodslist(true)
    // wx: wx.navigateTo({
    //   url: '../search/search',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let UserInforma=wx.getStorageSync('UserInforma')
    let params = JSON.parse(options.params);
    wx.setNavigationBarTitle({
      title: params.name
    })
    this.setData({
      params: params,
      UserInforma: UserInforma
    })
    this.getcategorylist()
    this.getgoodslist(true)
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
    if (this.data.total > this.data.start){
      this.getgoodslist(false)
    }
   

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})