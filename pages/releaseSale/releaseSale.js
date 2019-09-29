// pages/releaseSale/releaseSale.js
import api from '../../api/api'
import dateTimePicker from '../../utils/dateTimePicker.js'
import util from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    UserInforma: "",
    goodsList: [],
    goods_name: "", //商品名称
    goods_type: 'true', //是否是现货
    clude_bill: 'true', //是否含税价   做处理
    diliverPlace: [], //交货地点列表
    diliver_place: "国内",
    addressindex: 0,
    is_old_product: 'false', //是否是呆料   做处理
    price_type: 'true', //是否是阶梯价  出价方式 做处理
    seller_always: 'false', //售卖期限   做处理
    date: '2016-09-01',
    time: '12:01',
    dateTimeArray: null,
    startTimeArray: null,
    startTime: null, //开始时间
    dateTime: null, //结束时间
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
    complete_date: "2019/09/01", //预计交期
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
    this.setData({
      SteppedPriceListlength: this.data.SteppedPriceListlength,
      SteppedPriceListobj: this.data.SteppedPriceListobj
    })
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
        })
      }
      console.log(this.data.SteppedPriceListobj)
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
    console.log(e)
    if (e.detail.value == "") {
      this.setData({
        goodsList: []
      })
    } else {
      api.get('/api-g/goods-b/searchGoods', {
        start: 0,
        length: 10,
        name: e.detail.value,
        brand: this.data.UserInforma.userTagMap.brand,
      }).then((res) => {
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

        console.log(this.data.goodsList)
      })
    }
  },
  toDetail(val) {
    console.log(val)
    let data = val.currentTarget.dataset.item
    this.setData({
      goods_id: data.id,
      catergory_id: data.parent_id,
      brand_id: data.brand,
      goods_name: data.nick_name,
      goodsList: []
    })
  },
  RadioChange(e) {
    console.log(e)
    this.setData({
      goods_type: e.detail.value
    })
    if (e.detail.value == 'false') {
      this.setData({
        price_type: 'false'
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
      clude_bill: e.detail.value
    })
  },
  isoldproductChange(e) {
    console.log(e)
    this.setData({
      is_old_product: e.detail.value
    })
  },
  pricetypeChange(e) {
    this.setData({
      price_type: e.detail.value
    })
  },
  moq(e) {
    this.setData({
      moq: e.detail.value
    })
  },
  mpq(e) {
    this.setData({
      mpq: e.detail.value
    })
  },
  stockCount(e) {
    this.setData({
      stock_count: e.detail.value
    })
  },
  selleralwaysChange(e) {
    this.setData({
      seller_always: e.detail.value
    })
  },
  seckilPrice(e) {
    this.setData({
      seckil_price: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    console.log('picker下拉项发生变化后，下标为：', e.detail.value, this.data.diliverPlace)
    this.setData({
      addressindex: e.detail.value,
      diliver_place: this.data.diliverPlace[e.detail.value].name
    })
  },
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.complete_date = this.data.complete_date.replace(/-/g, '/')
    this.setData({
      complete_date: this.data.complete_date
    })
  },


  changeDateTime(e) {
    console.log(e)
    this.setData({
      dateTime: e.detail.value
    });
  },
  changeDateTimeColumn(e) {

    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },

  changestartTime(e) {
    this.setData({
      startTime: e.detail.value
    });
  },
  changestartTimeColumn(e) {
    console.log(e)
    var arr = this.data.startTime,
      dateArr = this.data.startTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      startTimeArray: dateArr,
      startTime: arr
    });
  },


  ChooseImage() {
    console.log('111')
    var _this = this
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        _this.data.imgList.push(tempFilePaths[0])
        _this.setData({
          imgList: _this.data.imgList
        })
        wx.uploadFile({
          url: 'https://api.113ic.com/api-f/files/uploadWithCloud?access_token=' + wx.getStorageSync('token') + '&fileSource=QINIUYUN&type=1&id=1',
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
            console.log(res)
            let img = JSON.parse(res.data).name
            if (_this.data.image_urls == "") {
              _this.data.image_urls = img
            } else {
              _this.data.image_urls = _this.data.image_urls + "@" + img
            }

            _this.setData({
              image_urls: _this.data.image_urls
            })
            console.log('https://www.113ic.com/' + img)
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
    console.log(this.data.diliver_place)

    if (this.data.diliver_place == "国内") {
      this.setData({
        priceunit: false
      })
    } else {
      this.setData({
        priceunit: true
      })
    }
    if (this.data.clude_bill == "true") {
      this.data.clude_bill = true
    } else {
      this.data.clude_bill = false
    }
    if (this.data.goods_type == "true") {
      this.data.goods_type = true
    } else {
      this.data.goods_type = false
    }
    if (this.data.is_old_product == "true") {
      this.data.is_old_product = true
    } else {
      this.data.is_old_product = false
    }

    if (this.data.price_type == "true") {
      this.data.price_type = true
      this.data.moq = this.data.SteppedPriceListobj.num0
      let arr = [];
      for (let index = 0; index < this.data.SteppedPriceListlength; index++) {
        if (this.data.SteppedPriceListobj['num' + index] && this.data.SteppedPriceListobj['price' + index]) {
          arr.push(`${this.data.SteppedPriceListobj['num' + index]}-${this.data.SteppedPriceListobj['price' + index]}`);
        }
      }
      console.log(arr)
      if (arr.length < 2) {
        wx.showToast({
          title: '阶梯价格至少有两组!',
          icon: 'none'
        })
        return;
      }
      this.data.price_level = arr.join("@")
    } else {
      this.data.price_type = false
      this.data.moq = ""
    }

    if (this.data.seller_always == "true") {
      this.data.seller_always = true
    } else {
      this.data.seller_always = false
    }

    this.setData({
      goods_count: this.data.stock_count
    })
    let startTimeP = this.data.startTimeArray[0][this.data.startTime[0]] + '/' + this.data.startTimeArray[1][this.data.startTime[1]] + '/' + this.data.startTimeArray[2][this.data.startTime[2]] + ' ' + this.data.startTimeArray[3][this.data.startTime[3]] + ':' + this.data.startTimeArray[4][this.data.startTime[4]] + ':' + this.data.startTimeArray[5][this.data.startTime[5]]

    let dateTimeP = this.data.dateTimeArray[0][this.data.dateTime[0]] + '/' + this.data.dateTimeArray[1][this.data.dateTime[1]] + '/' + this.data.dateTimeArray[2][this.data.dateTime[2]] + ' ' + this.data.dateTimeArray[3][this.data.dateTime[3]] + ':' + this.data.dateTimeArray[4][this.data.dateTime[4]] + ':' + this.data.dateTimeArray[5][this.data.dateTime[5]]
    if (!this.data.seller_always) {
      if (startTimeP >= dateTimeP) {
        wx.showToast({
          title: '售卖结束时间必须大于开始时间',
          icon: 'none'
        })
      }
    }
    console.log(startTimeP, dateTimeP)
    var obj = {
      is_old_product: this.data.is_old_product,
      goods_name: this.data.goods_name,
      goods_id: this.data.goods_id,
      catergory_id: this.data.catergory_id,
      diliver_place: this.data.diliver_place,
      goods_type: this.data.goods_type,
      priceunit: this.data.priceunit,
      clude_bill: this.data.clude_bill,
      price_type: this.data.price_type,
      seller_always: this.data.seller_always,
      seckil_price: this.data.seckil_price,
      moq: this.data.moq,
      mpq: this.data.mpq,
      stock_count: this.data.stock_count,
      goods_count: this.data.goods_count,
      image_urls: this.data.image_urls,
      support_bill: false,
      price_level: this.data.price_level,
      day_interval: this.data.day_interval,
      base_no: this.data.base_no,
      brand: this.data.brand,
      brand_id: this.data.brand_id,
      complete_date: this.data.complete_date,
      start_date: startTimeP,
      end_date: dateTimeP,
      access_token: wx.getStorageSync('token')
    }
    if (this.data.goods_type) {
      delete obj.complete_date
      obj.day_interval = "1"
    } else {
      //订货有交期，没批号
      delete obj.base_no;
      delete obj.day_interval;
    }
    if (this.data.seller_always) {
      //长期卖
      delete obj.start_date;
      delete obj.end_date;
    }
    console.log(obj)
    // api.get("/api-g/goods-b/publish?access_token=" + wx.getStorageSync('token'), obj).then((res) => {
    //   console.log(res)
    //   if (res.resultCode == "200") {
    //     wx.showToast({
    //       title: '发布成功',
    //       icon: 'none',
    //       duration: 1000,
    //       success: function() {
    //         wx.switchTab({
    //           url: '../home/home',
    //         })
    //       }
    //     })

    //   }
    // })
  },
  getAdress() {
    api.get('/api-g/goods-b/queryDictionarieList', {
      distinguish: "3",
      isable: 1
    }).then((res) => {
      console.log(res)
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
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      startTime: obj.dateTime,
      startTimeArray: obj.dateTimeArray
    });
    let userInfo = JSON.parse(wx.getStorageSync('UserInforma'))
    this.setData({
      UserInforma: userInfo,
      brand: userInfo.userTagMap.brand
    })
    console.log(userInfo)
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