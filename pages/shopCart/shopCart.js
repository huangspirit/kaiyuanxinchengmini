// pages/shopCart/shopCart.js
import api from '../../api/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    allChecked: false,
    unAllPrice: 0,
    usAllPrice: 0,
    goodsAllNum: 0,
    editgoodsShow: false,
    editText: '管理',
    deleteId: "",
    catergoryId: "",
    goodsId: "",
    sendData: {},
    payBtnShow: false,
    errorImg:app.globalData.errorImg,
    start:0,
    length:5,
    showDeclareType:false,//选择报关方式
  },
  getShopList() {
    api.get("/api-g/sc/queryShoppingCarList", {
      start: 0,
      length: 100,
      source: 1
    }).then(res => {
      if (res.resultCode == "200") {
        let list0 = res.data.data.map((item0,index0)=>{
          item0.checked = false;
          let list=item0.list.map((item,index)=>{
            item.checked=false;
            if (item.goodsStockCount<=item.moq){
              item.delbtnShow=true;
              item.addbtnShow=false;
              item.goodsNum = item.goodsStockCount;
            } else if (item.goodsStockCount > item.moq && (item.goodsStockCount<item.moq+item.mpq)){
              item.delbtnShow = true;
              item.addbtnShow = true;
              item.goodsNum = item.goodsStockCount;
            }else{
              item.delbtnShow = true;
              item.addbtnShow = false;
              item.goodsNum = item.moq;
            };
            if (item.priceType){
              let arr = item.priceLevel.split("@");
              for (var i = arr.length-1 ;i>=0;i--){
                let arr0 = arr[i].split("-");
                if(i==0){
                  item.goodsPrice = Number(arr0[1]);
                  return;
                }
                if (item.goodsNum > Number(arr0[0])){
                  item.goodsPrice = Number(arr0[1]);
                  return;
                }
              }
            }
            return item;
          })
          return item0;
        })
        this.setData({
          cartList: list0,
          allChecked:false
        })
        }
    })
  },
  editGoods() {
    this.data.editgoodsShow = !this.data.editgoodsShow
    for (let k = 0; k < this.data.cartList.length; k++) {
      this.data.cartList[k]['checked'] = false
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        this.data.cartList[k].list[i]['checked'] = false
      }
    }
    if (this.data.editgoodsShow) {
      this.data.editText = '完成'
    } else {
      this.data.editText = '管理'
    }
    this.setData({
      editgoodsShow: this.data.editgoodsShow,
      cartList: this.data.cartList,
      allChecked: false,
      editText: this.data.editText,
      goodsAllNum: 0,
      unAllPrice: 0,
      usAllPrice: 0,
    })
  },
  delete() {
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked) {
          this.data.deleteId = this.data.cartList[k].list[i].id
        }
      }
    }
    api.get("/api-g/sc/deleteSigletonShoppingCar", {
      id: this.data.deleteId
    }).then(res => {
    
      if (res.resultCode == "200") {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        this.editGoods()
        this.getShopList()
      }
    })
  },
  addFocus(val) {
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked && this.data.cartList[k].list[i].isenable) {
         
          this.data.catergoryId = this.data.cartList[k].list[i].catergoryId
          this.data.goodsId = this.data.cartList[k].list[i].goods_id
        }
      }
    }

    api.get('/api-g/gf/insertGoodsFavourite', {
      goods_id: this.data.catergoryId,
      catergory_id: this.data.goodsId,
      favour_type: "1"
    }).then(res => {
    
      if (res.resultCode == '200') {
        wx: wx.showToast({
          title: '收藏成功',
          icon: 'success',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        this.setData({
          allChecked: false
        })
        this.getShopList()
      }
    })
  },
  sonChecked(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k;
    let item = this.data.cartList[index].list[k];
    item.checked = !item.checked;
    let subuncount = 0
    let cartlist = this.data.cartList.map((item0, index0) => {
      let uncheckCount=0;
      let list = item0.list.map((item1, index1) => {
        if (index0 == index){
          if (index1 == k) {
            if(!item.checked){
              uncheckCount++;
            }
            return item;
          }else{
            if (!item1.checked) {
              uncheckCount++;
            }
            return item1;
          }
        }else{
          if (!item1.checked) {
            uncheckCount++;
          }
          return item1
        }
      })
      item0.checked = uncheckCount?false:true;
      if (!item0.checked){
        subuncount++
      }
      item0.list = list;
      return item0;
    })
    this.setData({
      cartList: cartlist,
      allChecked: subuncount?false:true
    })
    this.sum();
    this.payBtn();
  },
  subChecked(val) {
    let index = val.currentTarget.dataset.index;
    let checked = !this.data.cartList[index].checked;
    let uncheckCount=0
    let cartList = this.data.cartList.map((item0,index0)=>{
      if(index0==index){
        item0.checked=checked;
        let list = item0.list.map(item=>{
          item.checked = checked;
          return item;
        })
        item0.list=list
      }
      if (!item0.checked) {
        uncheckCount++;
      }
      return item0;
    })
    console.log(uncheckCount)
    this.setData({
      cartList: cartList,
      allChecked: uncheckCount>0?false:true
    });
    this.sum();
    this.payBtn();
  },
  allChecked() {
    let allChecked = !this.data.allChecked
    let cartlist = this.data.cartList.map((item0) => {
      item0.checked=allChecked
      let list = item0.list.map((item1) => {
        item1.checked = allChecked;
        return item1;
      })
      item0.list = list;
      return item0;
    })
    this.setData({
      cartList: cartlist,
      allChecked: allChecked
    })
    this.sum();
    this.payBtn();
  },
  payBtn() {
    let payShow = false
    for (let k = 0; k < this.data.cartList.length; k++) {
      for (let i = 0; i < this.data.cartList[k].list.length; i++) {
        if (this.data.cartList[k].list[i].checked == true) {
          payShow = true
        }
      }
    }
    if (payShow) {
      this.data.payBtnShow = true
    } else {
      this.data.payBtnShow = false
    }
    this.setData({
      payBtnShow: this.data.payBtnShow
    })
  },
  inputNum(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    let item = this.data.cartList[index].list[k];
    let c = Number(val.detail.value);
    if (item.goodsStockCount < item.moq) {
      c = item.goodsStockCount
      item.delbtnShow = true
      item.addbtnShow = true;
    } else {
      if (c >= item.goodsStockCount) {
        c = item.goodsStockCount;
        item.addbtnShow = true;
        item.delbtnShow = false

      } else if (c <= item.moq) {
        c = item.moq
        item.addbtnShow = false;
        item.delbtnShow = true
      } else {
        let s = c % item.mpq;
        let ss = item.mpq / 2;
        if (s < ss) {
          c = c - s;
          item.delbtnShow = false;
          item.addbtnShow = false;
        } else {
          if ((c - s + item.mpq) > item.goodsStockCount) {
            c = item.goodsStockCount
            item.delbtnShow = false;
            item.addbtnShow = true;
          } else {
            c = c - s + item.mpq;
            item.delbtnShow = false;
            item.addbtnShow = false;
          }
        }
      }
    }
    item.goodsNum = c;
    if (item.priceType){
      let arr = item.priceLevel.split("@");
      for (var i = arr.length - 1; i >= 0; i--) {
        let arr0 = arr[i].split("-");
        if (i == 0) {
          console.log(1)
          item.goodsPrice = Number(arr0[1]);
          break;
        }
       
        if (item.goodsNum > Number(arr0[0])) {
          item.goodsPrice = Number(arr0[1]);
          break;
        }
      }
    }
    let cartlist = this.data.cartList.map((item0, index0) => {
      if (index0 == index) {
        let list = item0.list.map((item1, index1) => {
          if (index1 == k) {
            return item;
          } else {
            return item1
          }
        })
        item0.list = list;
      }
      return item0;
    })
    this.setData({
      cartList: cartlist
    })
    this.sum()
  },
  addGoodsNum(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    let item = this.data.cartList[index].list[k];
    if (item.goodsNum + item.mpq > item.goodsStockCount){
      item.goodsNum = item.goodsStockCount;
      item.addbtnShow=true;
      item.delbtnShow=false;
    }else{
      item.goodsNum = item.goodsNum + item.mpq;
      item.addbtnShow = false;
      item.delbtnShow = false;
    }
    if (item.priceType){
      let arr = item.priceLevel.split('@')
      for(var i = arr.length-1;i>0;i--){
        let arr0 = arr[i].split('-')
        if (i == 0) {
          item.goodsPrice = Number(arr0[1]);
          break;
        }
        if (item.goodsNum > Number(arr0[0])){
          item.goodsPrice = Number(arr0[1]);
          break;
        }
      }
    }
    let cartlist = this.data.cartList.map((item0,index0)=>{
      if (index0 == index){
        let list = item0.list.map((item1, index1) => {
          if(index1==k){
            return item;
          }else{
            return item1
          }
        })
        item0.list=list;
      }
      return item0;
    })
    this.setData({
      cartList: cartlist
    })
    this.sum()
  },
  delGoodsNum(val) {
    let index = val.currentTarget.dataset.index
    let k = val.currentTarget.dataset.k
    let item = this.data.cartList[index].list[k];
    if (item.goodsNum - item.mpq <= item.moq) {
      item.goodsNum = item.moq;
      item.addbtnShow = false
      item.delbtnShow = true;
    } else {
      item.goodsNum = item.goodsNum - item.mpq;
      item.addbtnShow = false;
      item.delbtnShow = false;
    }
    if (item.priceType) {
      let arr = item.priceLevel.split('@')
      for (var i = arr.length - 1; i > 0; i--) {
        let arr0 = arr[i].split('-')
        if (i == 0) {
          item.goodsPrice = Number(arr0[1]);
          break;
        }
        if (item.goodsNum > Number(arr0[0])) {
          item.goodsPrice = Number(arr0[1]);
          break;
        }
      }
    }
    let cartlist = this.data.cartList.map((item0, index0) => {
      if (index0 == index) {
        let list = item0.list.map((item1, index1) => {
          if (index1 == k) {
            return item;
          } else {
            return item1
          }
        })
        item0.list = list;
      }
      return item0;
    })
    this.setData({
      cartList: cartlist
    })
    this.sum()
  },
  sum(){
    console.log("求和")
    let goodsAllNum=0
    let unAllPrice=0;
    let usAllPrice=0
    this.data.cartList.forEach(item0=>{
      item0.list.forEach(item=>{
        if(item.checked && item.isenable){
          goodsAllNum+=item.goodsNum;
          if (item.priceUnit){
            usAllPrice += item.goodsPrice * item.goodsNum
          }else{
            unAllPrice += item.goodsPrice * item.goodsNum
          }
        }
      })
    })
    this.setData({
      goodsAllNum: goodsAllNum,
      unAllPrice: unAllPrice,
      usAllPrice: usAllPrice
    })
  },
  toPay() {
    // if (this.data.adressList.length <= 0) {
    //   wx.showToast({
    //     title: '请选择收货地址',
    //     icon: 'none'
    //   })
    // }
    //去结算
    let orderJson = [];
    //计算有多少个美元产品
    let count = 0;
    this.data.cartList.forEach(item0 => {
      item0.list.forEach(item => {
        if (item.checked && item.isenable) {
          if (item.priceUnit) {
            count++;
          }
          let obj = {
            seckill_goods_id: item.seller_goods_id,
            goods_id: item.goods_id,
            goods_name: item.goods_name,
            goods_count: item.goodsNum,
            goods_price: item.goodsPrice * item.moq,
            order_channe: 1,
            clude_bill: item.includBill,
            pay_channe: 1,
            price_unit: item.priceUnit,
            goods_type: item.goods_type,
            sellerName: item0.sellerName,
            sellerHeader: item0.sellerUrl,
            seller_id: item0.sellerId,
            tag: item0.sellerTag,
            goodsDesc: item.goodsDesc,
            goodsImage: item.goodsImageUrl,
            diliver_place: item.diliverPlace,
            sellerGoodsImageUrl: item.sellerGoodsImageUrl
          };
          if (!item.goods_type) {
            //标识期货
            obj = {
              ...obj,
              complete_date: item.deliverTime,
              diliver_date: item.deliverTime,
              end_date: item.endTime
            };
          }
          orderJson.push(obj);
        }
      });
    });
    if (orderJson.length < 1) {
      wx.showToast({
        title: '请选择商品',
      })
    }
    let billObj = {
      billtype: "1",
      content_id: "1"
    };
    // 生成bill对象
    this.data.sendData = {
      bill: JSON.stringify(billObj),
      dilivertype: "0",//到付
      order: JSON.stringify(orderJson),
      add_id: 1,
      type: 0,
      orderSource: 1
    };
    if (count > 1) {
      //用户确认报关方式
      this.dialog.show()
    } else {
      this.data.sendData['togetherPay'] = false
      api.post('/api-g/goods-b/orderCheck', this.data.sendData).then((res) => {
        wx.setStorageSync('buyOneGoodsDetail', JSON.stringify({
          data: JSON.stringify(res),
          obj2: JSON.stringify(this.data.sendData)
        }))
        wx.navigateTo({
          url: '../pay/pay',
        })
      })
    }
    // api.get('/api-order/wechat/getWechatSamrtPay', { message_id: 'JY-74201909161391', type:0}).then((res) => {
    //   console.log(res)
    // })
    
  },
  popupCancel() {
    this.dialog.hide();
    this.data.sendData['togetherPay'] = false
    console.log(this.data.sendData);
    api.post('/api-g/goods-b/orderCheck', this.data.sendData).then((res) => {
      wx.setStorageSync('buyOneGoodsDetail', JSON.stringify({
        data: JSON.stringify(res),
        obj2: JSON.stringify(this.data.sendData)
      }))
      wx.navigateTo({
        url: '../pay/pay',
      })
    })
  },
  popupConfirm() {
    this.dialog.hide();
    this.data.sendData['togetherPay'] = true
    console.log(this.data.sendData)
    api.post('/api-g/goods-b/orderCheck', this.data.sendData).then((res) => {
      wx.setStorageSync('buyOneGoodsDetail', JSON.stringify({
        data: JSON.stringify(res),
        obj2: JSON.stringify(this.data.sendData)
      }))
      wx.navigateTo({
        url: '../pay/pay',
      })
    })
   },
  tohome() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  // addAdress() {
  //   wx.navigateTo({
  //     url: '../editAdress/editAdress',
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    this.dialog = this.selectComponent('#dialog')
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
    this.getShopList()
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
    this.getShopList()
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