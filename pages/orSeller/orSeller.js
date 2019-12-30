import api from '../../api/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseURL3: app.globalData.baseURL3,
    brand:{},
    seller_id:'',
    goodslist: [], 
    descHeight: true,
    descText: "查看更多",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: JSON.parse(options.params).name
    });
    api.get('/api-g/gods-anon/searchResult', JSON.parse(options.params)).then(res => {
        if (res.resultCode == "200") {
          this.setData({
            brand: res.data.brand,
            seller_id: res.data.brand.sellerId
          })
          if (res.data.brand.hasSeller){
            this.getgoodslist();
            this.getCommitlist();
          }
          
        }
      })
  },
  descShow() {
    this.data.descHeight = !this.data.descHeight
    if (!this.data.descHeight) {
      this.setData({
        descText: '收起',
        descHeight: false
      })

    } else {
      this.setData({
        descText: '查看更多',
        descHeight: true
      })
    }
  },
  getgoodslist(){
    api.get('/api-g/gods-anon/queryDirectGoods', {
      start:0,
      length:50,
      seller_id:this.data.seller_id
    }).then(res=>{
      this.setData({
        goodslist: res.data.data.map(item => {
          if (item.sellerGoodsImageUrl) {
            item.sellerGoodsImage = this.data.baseURL3 + "/" + item.sellerGoodsImageUrl.split("@")[0];
          }
          return item;
        })
      })
    })
  },
  getCommitlist(){
    api.get("/api-order/order-anon/orderCommentList",{
      start:0,
      length:50,
      seller_id:this.data.seller_id
    }).then(res=>{
      this.setData({
        commitlist:res.data.data.map(item=>{
          let arr = item.commentPicture.split("@");
          let list=[];
          if(arr[1]){
            arr.forEach((item0,index)=>{
              if(index>0){
                list.push(arr[0] + item0)
              }
            })
          };
          return { ...item, commentPicturelist:list}
        })
      })
  
    })
  },
  toDetail(val) {
    var obj = {}
    obj['documentid'] = val.currentTarget.dataset.item.goods_id
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