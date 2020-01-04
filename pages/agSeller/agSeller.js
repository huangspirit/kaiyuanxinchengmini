import api from '../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseURL3: app.globalData.baseURL3,
    settleTime:'',
    sellerinfo: {},
    seller_id: '',
    goodslist: [],
    showitem:false,
    ftotal:0,
    fobj:{},
    total:0,
    goodstype:'',
    brandid:"",
    categoryid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
    });
    api.get('/api-g/gods-anon/querySellerShop', {
      seller_id:options.seller_id
    }).then(res => {
      if (res.resultCode == "200") {
        this.setData({
          settleTime: res.data.qualification.create_time.split(" ")[0],
          sellerinfo: res.data,
          seller_id: options.seller_id
        })
        this.getgoodslist();
        this.getCommitlist();
      }
    })
  },
  //显示隐藏筛选条件
  showitemtap(){
    this.setData({
      showitem:true
    })
  },
  hideitemtap(){
    this.setData({
      showitem: false
    })
  },
  noevent(){
    console.log("in")
  },
  btngoodstype(val){
    if (this.data.goodstype === val.currentTarget.dataset.type){
      this.setData({
        goodstype: ""
      })
    }else{
      this.setData({
        goodstype: val.currentTarget.dataset.type
      })
    }
    
    this.getnum()
  },
  btnbrand(val){
    if (this.data.brandid === val.currentTarget.dataset.item.brandId){
      this.setData({
        brandid: ""
      })
    }else{
      this.setData({
        brandid: val.currentTarget.dataset.item.brandId
      })
    }
    this.getnum()
  },
  btncategory(val) {
    if(this.data.categoryid===val.currentTarget.dataset.item.cid){
      this.setData({
        categoryid: ""
      })
    }else{
      this.setData({
        categoryid: val.currentTarget.dataset.item.cid
      })
    }
    this.getnum()
  },
  clearitem(){
    this.setData({
      brandid:'',
      categoryid:'',
      goodstype:'',
      name:''
    })
    this.getnum();
  },
  toSearch(val){
    console.log(val)
    this.setData({
      name:val.detail.value
    })
    this.getnum()
  },
  confirmitem(){
    wx.showLoading({
      title: '加载中...',
    })
    api.get('/api-g/gods-anon/queryDirectGoods', this.data.fobj).then(res => {
      wx.hideLoading()
      this.setData({
        total: res.data.total,
        ftotal: res.data.total,
        showitem:false,
        goodslist: res.data.data.map(item => {
          if (item.sellerGoodsImageUrl) {
            item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
          }
          return item;
        })
      })
    })
  },
  getnum(){
    let obj={
      start: 0,
      length: 50,
      seller_id: this.data.seller_id
    }
    if(this.data.goodstype===true || this.data.goodstype===false){
      obj.goods_type=this.data.goodstype
    }
    if(this.data.name){
      obj.name=this.data.name;
    }
    if(this.data.brandid){
      obj.brand_id=this.data.brandid
    }
    if(this.data.categoryid){
      obj.catergory_id=this.data.categoryid;
    }
    this.setData({
      fobj:obj
    })
    api.get('/api-g/gods-anon/queryDirectGoods',obj).then(res=>{
      console.log(res)
      this.setData({
        ftotal:res.data.total
      })
    })
  },
  getgoodslist() {
    wx.showLoading({
      title: '加载中...',
    })
    api.get('/api-g/gods-anon/queryDirectGoods', {
      start: 0,
      length: 50,
      seller_id: this.data.seller_id
    }).then(res => {
      wx.hideLoading()
      this.setData({
        total:res.data.total,
        ftotal:res.data.total,
        goodslist: res.data.data.map(item => {
          if (item.sellerGoodsImageUrl) {
            item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
          }
          return item;
        })
      })
    })
  },
  getCommitlist() {
    api.get("/api-order/order-anon/orderCommentList", {
      start: 0,
      length: 50,
      seller_id: this.data.seller_id
    }).then(res => {
      this.setData({
        commitlist: res.data.data.map(item => {
          let arr = item.commentPicture.split("@");
          let list = [];
          if (arr[1]) {
            arr.forEach((item0, index) => {
              if (index > 0) {
                list.push(arr[0] + item0)
              }
            })
          };
          return { ...item, commentPicturelist: list }
        })
      })
      console.log(this.data.commitlist)
    })
  },
  toDetail(val) {
    var obj = {}
    obj['id'] = val.currentTarget.dataset.item.goods_id
    obj['tag'] = 'goodsinfo'
    obj['name'] = val.currentTarget.dataset.item.goods_name
    var routerParams = JSON.stringify(obj)
    let storageItem = JSON.stringify(val.currentTarget.dataset.item)
    wx: wx.setStorageSync('productDetail', storageItem)
    wx: wx.navigateTo({
      url: '../goodsDetail/goodsDetail?params=' + routerParams,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toBrandDetail(val){
    var obj = {}
    obj['id'] = val.currentTarget.dataset.item.id
    obj['tag'] = 'brand'
    obj['name'] = val.currentTarget.dataset.item.branda
    var routerParams = JSON.stringify(obj);
    wx: wx.navigateTo({
      url: '../orSeller/orSeller?params=' + routerParams,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})