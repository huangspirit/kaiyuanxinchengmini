// pages/releaseSale/releaseSale.js
import api from '../../api/api'
import dateTimePicker from '../../utils/dateTimePicker.js'
import util from '../../utils/util'
let app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.host,
    UserInforma: "",
    goodsList: [],
    goods_name: "", //商品名称
    goods_type: true, //是否是现货
    clude_bill: false, //是否含税价   做处理
    diliverPlace: [], //交货地点列表
    diliver_place: "国内",
    addressindex: 0,
    is_old_product: false, //是否是呆料   做处理
    price_type: true, //是否是阶梯价  出价方式 做处理
    seller_always: true, //售卖期限   做处理
    date: '2016-09-01',
    time: '12:01',
    dateTimeArray: null,
    startTimeArray: null,
    dateCompleteTimeArray:null,
    startTime: null, //开始时间
    dateTime: null, //结束时间
    complete_date:null,//预计交期
    completeStart:'',
    startYear: 1970,
    endYear: 2100,
    imgList: [],
    base_no: "", // 批号
    moq: "", // 最小订购数量
    mpq: "", //最小增量
    stock_count: "", //可卖数量
    goods_count: "", // 等同于可卖数量 
    seckil_price: "", //一口价
    price_level: "", //阶梯价
    goods_id: "", //商品id
    brand_id: "",
    brand: "",
    day_interval: "1", // 交期 根据是否现货判断
    complete_date: "", //预计交期
    image_urls: "", // 上传得图片
    priceunit: false, //金钱类型 根据交货地判断
    catergory_id: 11,
    SteppedPriceListlength: 1,
    SteppedPriceListobj: {
      placeholderprice0: "大于0",
      placeholdernum0: "大于0"
    }

  },
  priceNum(e) {
    let index = e.currentTarget.dataset.index
    this.data.SteppedPriceListobj['num' + index] = e.detail.value
    this.data.SteppedPriceListobj['placeholdernum' + (index + 1)] = '大于' + this.data.SteppedPriceListobj['num' + index]
    console.log(index)
    if(index==0){
      console.log(e)
      this.setData({
       SteppedPriceListlength: this.data.SteppedPriceListlength,
       SteppedPriceListobj: this.data.SteppedPriceListobj,
        moq: e.detail.value
      })
    }else{
      this.setData({
        SteppedPriceListlength: this.data.SteppedPriceListlength,
        SteppedPriceListobj: this.data.SteppedPriceListobj,
      })
    }
  },
  numBlur(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    if (index != 0) {
      console.log(e.detail.value < this.data.SteppedPriceListobj['num' + (index - 1)])
      if (e.detail.value < this.data.SteppedPriceListobj['num' + (index - 1)]) {
        this.data.SteppedPriceListobj['num' + index] = ""
      } else {
        this.data.SteppedPriceListobj['num' + index] = e.detail.value
        this.data.SteppedPriceListobj['placeholdernum' + (index + 1)] = '大于' + this.data.SteppedPriceListobj['num' + index]
      }
    } else {
      this.data.SteppedPriceListobj['num' + index] = e.detail.value
      this.data.SteppedPriceListobj['placeholdernum' + (index + 1)] = '大于' + this.data.SteppedPriceListobj['num' + index]
    }
    this.setData({
      SteppedPriceListlength: this.data.SteppedPriceListlength,
      SteppedPriceListobj: this.data.SteppedPriceListobj
    })
  },
  leverPrice(e) {
    let index = e.currentTarget.dataset.index
    this.data.SteppedPriceListobj['price' + index] = e.detail.value
    this.data.SteppedPriceListobj['placeholderprice' + (index + 1)] = '小于' + this.data.SteppedPriceListobj['price' + index]
    this.setData({
      SteppedPriceListlength: this.data.SteppedPriceListlength,
      SteppedPriceListobj: this.data.SteppedPriceListobj
    })
  },
  priceBlur(e) {
    let index = e.currentTarget.dataset.index
    if (index != 0) {
      console.log(e.detail.value > this.data.SteppedPriceListobj['price' + (index - 1)])
      if (e.detail.value > this.data.SteppedPriceListobj['price' + (index - 1)]) {
        this.data.SteppedPriceListobj['price' + index] = ""
      } else {
        this.data.SteppedPriceListobj['price' + index] = e.detail.value
        this.data.SteppedPriceListobj['placeholderprice' + (index + 1)] = '小于' + this.data.SteppedPriceListobj['price' + index]
      }
    } else {
      this.data.SteppedPriceListobj['price' + index] = e.detail.value
      this.data.SteppedPriceListobj['placeholderprice' + (index + 1)] = '小于' + this.data.SteppedPriceListobj['price' + index]
    }
    this.setData({
      SteppedPriceListlength: this.data.SteppedPriceListlength,
      SteppedPriceListobj: this.data.SteppedPriceListobj
    })
  },
  addLever(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.SteppedPriceListlength == 3) {
      wx.showToast({
        title: '最多添加三个阶梯价',
      })
    } else {
      console.log(this.data.SteppedPriceListobj)
      if (this.data.SteppedPriceListobj['num' + index] && this.data.SteppedPriceListobj['num' + index] != 0 && this.data.SteppedPriceListobj['price' + index] && this.data.SteppedPriceListobj['price' + index] != 0) {
        this.data.SteppedPriceListobj['placeholderprice' + (index + 1)] = '小于' + this.data.SteppedPriceListobj['price' + index]
        this.data.SteppedPriceListobj['placeholdernum' + (index + 1)] = '大于' + this.data.SteppedPriceListobj['num' + index]
        this.data.SteppedPriceListlength += 1
        this.setData({
          SteppedPriceListlength: this.data.SteppedPriceListlength,
          SteppedPriceListobj: this.data.SteppedPriceListobj
        })
      } else {
        wx.showToast({
          title: '请填写价格',
          icon:'none'
        })
      }
    }
  },
  leverReset() {
    this.setData({
      SteppedPriceListlength: 1,
      SteppedPriceListobj: {
        placeholderprice0: "大于0",
        placeholdernum0: "大于0"
      }
    })
  },
  goodsName(e) {
    if (e.detail.value == "") {
      this.setData({
        goodsList: []
      })
    } else {
      let obj={
        start: 0,
        length: 10,
        name: e.detail.value,
      }
      if (this.data.UserInforma.userTagMap.brand){
        obj.brand = this.data.UserInforma.userTagMap.brand
      }
      api.get('/api-g/goods-b/searchGoods', obj).then((res) => {
        this.setData({
          goodsList: res.data.data
        })
        if (this.data.goodsList.length > 0) {
          for (let i = 0; i < this.data.goodsList.length; i++) {
            this.data.goodsList[i].nick_name = this.data.goodsList[i].nick_name.replace('<font color="red">', "")
            this.data.goodsList[i].nick_name = this.data.goodsList[i].nick_name.replace('</font>', "")
            this.data.goodsList[i]['nameLight'] = util.hilightWord(e.detail.value, this.data.goodsList[i].nick_name)
          }
          this.setData({
            goodsList: res.data.data
          })
        }
      })
    }
  },
  toDetail(val) {
    let data = val.currentTarget.dataset.item
    this.setData({
      goods_id: data.id,
      catergory_id: data.parent_id,
      brand_id: data.brand,
      goods_name: data.nick_name,
      goodsList: []
    })
  },
  //器件状态改变
  RadioChange(e) {
    this.setData({
      goods_type: e.detail.value=='true'?true:false,
    })
    if (e.detail.value == 'false'){
      this.setData({
        price_type:false
      })
    }
  },
  baseno(e) {
    this.setData({
      base_no: e.detail.value
    })
  },
  cludebillChange(e) {
    this.setData({
      clude_bill: e.detail.value=='true'?true:false
    })
  },
  isoldproductChange(e) {
    this.setData({
      is_old_product: e.detail.value=='true'?true:false
    })
  },
  pricetypeChange(e) {
    this.setData({
      price_type: e.detail.value=='true'?true:false,
      moq:"",
      stock_count:''
    })
    if(this.data.price_type){
      this.setData({
        moq: Number(this.data.SteppedPriceListobj.num0)
      })
    }
  },
  mpqblur(e){
    this.setData({
      mpq: Number(e.detail.value)
    })
  },
  moqblur(e){
    console.log(e)
    if (this.data.price_type) {
      console.log(this.data.SteppedPriceListobj)
      if (Number(e.detail.value)> this.data.SteppedPriceListobj.num0) {
        this.setData({
          moq:Number(e.detail.value)
        })
      }else{
        this.setData({
          moq: Number(this.data.SteppedPriceListobj.num0)
        })
      }
    } else {
      this.setData({
        moq: Number(e.detail.value)
      })
    }
  },
  stockCountblur(e) {
    if (Number(e.detail.value)> this.data.moq) {
      this.setData({
        stock_count: Number(e.detail.value)
      })
    }else{
      this.setData({
        stock_count: this.data.moq
      })
    }

  },
  selleralwaysChange(e) {
    if (e.detail.value == 'false'){
      var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      this.setData({
       dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        startTime: obj.dateTime,
        startTimeArray: obj.dateTimeArray,
        complete_date: "",
        dateCompleteTimeArray: obj.dateTimeArray,
      });
    }
    this.setData({
      seller_always: e.detail.value=='true'?true:false
    })
  },
  changestartTime(e) {
    this.setData({
      startTime: e.detail.value,
      dateTime:e.detail.value,
      complete_date: "",
    });
  },
  changeDateTime(e) {
    let dateTime=e.detail.value;
    let dateTimeP =
      this.data.dateTimeArray[0][dateTime[0]] + '-'
      + this.data.dateTimeArray[1][dateTime[1]] + '-'
      + this.data.dateTimeArray[2][dateTime[2]] + ' '

      this.setData({
        dateTime: e.detail.value,
        complete_date: dateTimeP,
        completeStart:dateTimeP
      });
  },
  
  changeCompleteDateTime(e) {
    this.setData({
      complete_date: e.detail.value
    });
  },
  changeDateTimeColumn(e) {

    // var arr = this.data.dateTime,
    //   dateArr = this.data.dateTimeArray;
    // arr[e.detail.column] = e.detail.value;
    // dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    // this.setData({
    //   dateTimeArray: dateArr,
    //   dateTime: arr
    // });
  },
  
  changestartTimeColumn(e) {
    // var arr = this.data.startTime,
    //   dateArr = this.data.startTimeArray;
    // arr[e.detail.column] = e.detail.value;
    // dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    // this.setData({
    //   startTimeArray: dateArr,
    //   startTime: arr
    // });
  },
  
  seckilPrice(e) {
    this.setData({
      seckil_price: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      addressindex: e.detail.value,
      priceunit: e.detail.value == 1 ? true : false,
      diliver_place: this.data.diliverPlace[e.detail.value].name
    })
  },
  // bindMultiPickerChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     multiIndex: e.detail.value
  //   })
  // },
  // bindMultiPickerColumnChange: function(e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   var data = {
  //     multiArray: this.data.multiArray,
  //     multiIndex: this.data.multiIndex
  //   };
  //   data.multiIndex[e.detail.column] = e.detail.value;
  // },

  // bindDateChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.data.complete_date = this.data.complete_date.replace(/-/g, '/')
  //   this.setData({
  //     complete_date: this.data.complete_date
  //   })
  // },

  ChooseImage() {
    var _this = this
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        _this.data.imgList.push(tempFilePaths[0])
        _this.setData({
          imgList: _this.data.imgList
        })
        wx.uploadFile({
          url: _this.data.host+'/api-f/files/uploadWithCloud?access_token=' + wx.getStorageSync('token') + '&fileSource=QINIUYUN&type=1&id=1',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'access_token': wx.getStorageSync('token')
          },
          success: function(res) {
            let img = JSON.parse(res.data).name
            if (_this.data.image_urls == "") {
              _this.data.image_urls = img
            } else {
              _this.data.image_urls = _this.data.image_urls + "@" + img
            }

            _this.setData({
              image_urls: _this.data.image_urls
            })
          }
        })
      },
    })
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgList: this.data.imgList
    })
  },
  submit() {
    if (!this.data.seller_always) {
      let startTimeP =
        this.data.startTimeArray[0][this.data.startTime[0]] + '/'
        + this.data.startTimeArray[1][this.data.startTime[1]] + '/'
        + this.data.startTimeArray[2][this.data.startTime[2]] + ' '
        + this.data.startTimeArray[3][this.data.startTime[3]] + ':'
        + this.data.startTimeArray[4][this.data.startTime[4]] + ':'
        + this.data.startTimeArray[5][this.data.startTime[5]]

      let dateTimeP =
        this.data.dateTimeArray[0][this.data.dateTime[0]] + '/'
        + this.data.dateTimeArray[1][this.data.dateTime[1]] + '/'
        + this.data.dateTimeArray[2][this.data.dateTime[2]] + ' '
        + this.data.dateTimeArray[3][this.data.dateTime[3]] + ':'
        + this.data.dateTimeArray[4][this.data.dateTime[4]] + ':'
        + this.data.dateTimeArray[5][this.data.dateTime[5]]
      if (startTimeP >= dateTimeP) {
        wx.showToast({
          title: '售卖结束时间必须大于开始时间',
          icon: 'none'
        })
        return;
      }
    }
    if (!this.data.goods_type) {
      let time = this.data.dateTimeArray[0][this.data.dateTime[0]] + '-'
        + this.data.dateTimeArray[1][this.data.dateTime[1]] + '-'
        + this.data.dateTimeArray[2][this.data.dateTime[2]];
      if (this.data.complete_date <= time) {
        wx.showToast({
          title: '预计交期必须大于售卖结束时间',
          icon: 'none'
        })
        return;
      }
    }
    let obj = {
      goods_name: this.data.goods_name,
      goods_id: this.data.goods_id,
      catergory_id: this.data.catergory_id,
      diliver_place: this.data.diliver_place,
      goods_type: this.data.goods_type,
      priceunit: this.data.priceunit,
      clude_bill: this.data.priceunit ? false : this.data.clude_bill,
      support_bill: this.data.clude_bill ? true : false,
      price_type: this.data.price_type,
      seller_always: this.data.seller_always,
      moq: this.data.moq,
      mpq: this.data.mpq,
      stock_count: this.data.stock_count,
      goods_count: this.data.stock_count,
      image_urls: this.data.image_urls,
      brand_id: this.data.brand_id,
    }
    if (this.data.UserInforma.userTagMap.tag==1) {
      obj.brand = this.data.UserInforma.userTagMap.brand
    }
    if(this.data.goods_type){
      obj.day_interval = this.data.day_interval;
      obj.is_old_product= this.data.is_old_product;
      if (this.data.base_no){
        obj.base_no= this.data.base_no;
      }
    }else{
      obj.complete_date = this.data.complete_date.split("-").join("/")
    }
    if (this.data.price_type) {
      console.log(this.data.SteppedPriceListobj);
      if (this.data.SteppedPriceListlength < 2) {
        wx.showToast({
          title: '阶梯价格至少有两组!',
          icon: 'none'
        })
        return;
      }
      let arr = [];
      for (let index = 0; index < this.data.SteppedPriceListlength; index++) {
        if (this.data.SteppedPriceListobj['num' + index] && this.data.SteppedPriceListobj['price' + index]) {
          arr.push(`${this.data.SteppedPriceListobj['num' + index]}-${this.data.SteppedPriceListobj['price' + index]}`);
        }
      }
      obj.price_level = arr.join("@")
    } else {
      obj.seckil_price = this.data.seckil_price
    };
    if (this.data.seller_always) {
      obj.day_interval = this.data.day_interval
    } else {
     
      obj.start_date = startTimeP
      obj.end_date = dateTimeP
    }
    var _this=this;
    api.postForm("/api-g/goods-b/publish",obj).then(res=>{
      if (res.resultCode == "200") {
        wx.showModal({
          title: '提示',
          content: '器件发布成功',
          showCancel:true,
          cancelText:'返回',
          confirmText:'继续发布',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../releaseSale/releaseSale'
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        // wx.showToast({
        //   title: '发布成功',
        //   icon: 'success',
        //   duration: 1000,
        //   success: function () {
        //     wx.switchTab({
        //       url: '../home/home',
        //     })
        //   }
        // })

      }
    })
  },
  getAdress() {
    api.get('/api-g/goods-b/queryDictionarieList', {
      distinguish: "3",
      isable: 1
    }).then((res) => {
      this.setData({
        diliverPlace: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAdress()
    let userInfo = JSON.parse(wx.getStorageSync('UserInforma'))
    this.setData({
      UserInforma: userInfo,
      brand: userInfo.userTagMap.brand
    });
    console.log(options)
    if (!options || !options.name){
      return;
    }else{
      this.setData({
        goods_name:options.name
      })
    }
    let obj = {
      start: 0,
      length: 10,
      name:options.name,
    }
    if (this.data.UserInforma.userTagMap.brand) {
      obj.brand = this.data.UserInforma.userTagMap.brand
    }
    api.get('/api-g/goods-b/searchGoods', obj).then((res) => {
      console.log(res)
      if(res.data.total==0){
        return;
      }
      var data=res.data.data[0];
      this.setData({
        goods_id: data.id,
        catergory_id: data.parent_id,
        brand_id: data.brand,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(options) {

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