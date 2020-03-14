// pages/settle/settle.js
import api from '../../api/api'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.host,
    date:"",
    currentDateTag:'',
    options: [],
    defaultOption: {
      id: '000',
      name: '选择入驻类型'
    },
    hideModal: true,
    china: [],
    alphabet: [],
    brandlist: {},
    oneitemlist: [],
    selectedbrand: {},
    selectedbrandArr: [],
    maxBrandLength: 5,
    currenAlphabet: 'china',
    formBrandlist: [],
    form:{},
    previewImage:{},
    hasCheck:false
  },
  setHasCheck(e){
    this.setData({
      hasCheck:!this.data.hasCheck
    })
  },
  subjoin(){
    if (!(this.data.form.handimage && this.data.form.identityposimg && this.data.form.identitynegimg && this.data.form.enterpriseplatformidentity)){
      wx.showToast({
        title: '请按照要求填写平台运营者的身份信息',
        icon: "none"
      })
      return;
    }
    if (this.data.form.residencetype != "3" && (!this.data.form.creditcode || !this.data.form.companyname)){
      wx.showToast({
        title: '请按照要求填写企业统一社会信用代码并校验通过',
        icon: "none"
      })
      return;
    }
   //处理品牌
    if (this.data.form.residencetype != "3" && this.data.formBrandlist.length == 0) {
      wx.showToast({
        title: '请选择品牌',
        icon: "none"
      })
      return
    };
    let brand={}
    if (this.data.form.residencetype == 1 || this.data.form.residencetype == 2){
      this.data.formBrandlist.map((item, index) => {
        if (index == 0) {
          brand.qualification = item.resUrl;
          brand.brand = item.brand;
          brand.qualificationtime =
            item.startDate +  "-" + item.endDate ;
        } else if (index > 0) {
          brand.qualification = brand.qualification + "@" + item.resUrl;
          brand.brand = brand.brand + "@" + item.brand;
          brand.qualificationtime =
            brand.qualificationtime +
            "@" +
            item.startDate +  "-" + item.endDate ;
        }
      })
    } else if (this.data.form.residencetype == 18){
      this.data.formBrandlist.map((item, index) => {
        if (index == 0) {
          brand.brand = item.brand;
        } else if (index > 0) {
          brand.brand = brand.brand + "@" + item.brand;
        }
      })
    };
    console.log(this.data.form)
    if(this.data.hasCheck){
      api.post("/api-b/factoryApply/insertFactoryApply",this.data.form).then(res=>{
        console.log(res)
        wx.navigateBack({
          delta:1
        })
      })
    }else{
      wx.showToast({
        title: '请同意大麦晶城入驻协议',
        icon:"none"
      })
    }
  },
  showItem(){
    // this.setData({
    //   hasCheck:!this.data.hasCheck
    // })
    wx.navigateTo({
      url: '../settleitem/settleitem',
    })
  },
  //校验统一社会信用代码
  getCompanyInfo(){
    api.get("/api-b/vipApply/queryCompnayInfo", { creditNo: this.data.form.creditcode}).then(res=>{
      if(res.data){
        let obj={
          companydetailaddress:res.data.address,
          establishmenttime: res.data.startDate.split(" ")[0],
          businesslicensestarttime: res.data.tremsStart.split(" ")[0],
          businesslicenseendtime: res.data.termsEnd.split(" ")[0],
          legalagent:res.data.operName,
          companyname:res.data.companyName,
          businesslicensenum: res.data.no,
          registeredcapital : res.data.registCapi
        }
        this.setData({
          form:{
            ...this.data.form,
            ...obj
          }
        
        })
      }else{
        wx.showToast({
          title: '未查询相关的企业讯息',
        })
      }
      
    })
  },
//输入赋值
  setvalue(e){
    let tag = e.currentTarget.dataset.tag
    let obj = this.data.form;
    obj[tag] = e.detail.value;
    this.setData({
      form: obj
    });
    if (tag =="creditcode"){
     let obj={
       companydetailaddress: "",
       establishmenttime:"",
       businesslicensestarttime:"",
       businesslicenseendtime: "",
       legalagent:"",
       companyname: "",
       businesslicensenum: "",
       registeredcapital: ""
     }
      this.setData({
        hasCheck:false,
       form:{
         ...this.data.form,
         ...obj
       }
      })
    }
  },
  //时间
  bindDateChange: function (e) {
    let arr = this.data.formBrandlist.map((item,index)=>{
      if(index==e.currentTarget.dataset.index){
        item[e.currentTarget.dataset.tag] = e.detail.value
      }
      return item
    })
    this.setData({
      date: e.detail.value,
      formBrandlist:arr
    })
  },
  //删除图片
  delImage(e){
    let index=e.currentTarget.dataset.index;
    let priviewImageARR = this.data.previewImage.taxpayerimg;
    priviewImageARR.splice(index, 1);
    let resArr = this.data.form.taxpayerimg.split("@");
    resArr.splice(index, 1);
    this.setData({
      previewImage:{
       // ...this.data.previewImage,
        taxpayerimg: priviewImageARR
      },
      form:{
        ...this.data.form,
        taxpayerimg: resArr.join("@")
      }
    })
    console.log(this.data)
  },
  //上传品牌的资质图
  ChooseImage(e) {
    let tag=e.currentTarget.dataset.tag;
    var _this = this
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        if (tag == "qualificationmapimg" || tag == "identityposimg" || tag == "identitynegimg" || tag == "handimage"){
          let obj={}
          obj[tag] = tempFilePaths
          _this.setData({
            previewImage:{
              ..._this.data.previewImage,
              ...obj
            }
          })
        } else if (tag == "taxpayerimg"){
            //需要的一个数组
          let obj = {}
          if (_this.data.previewImage[tag]){
            if (_this.data.previewImage[tag].length<_this.data.formBrandlist.length){
              obj[tag] = _this.data.previewImage[tag]
              obj[tag].push(tempFilePaths)
            }else{
             wx.showToast({
                title: "上传的资格图片和选择的品牌数一一对应",
                icon: 'none',
              })
              return;
            }
          }else{
            if (_this.data.formBrandlist.length){
              obj[tag] = [tempFilePaths];
            }else{
              wx.showToast({
                title: "请先选择品牌",
                icon: 'none',
              })
            }
            
          }
          _this.setData({
            previewImage: {
              ..._this.data.previewImage,
              ...obj
            }
          })
          console.log(_this.data)
        }else{
          let arr = _this.data.formBrandlist.map((item, index) => {
            if (index == e.currentTarget.dataset.index) {
              item.url = tempFilePaths
            }
            return item;
          })
          _this.setData({
            formBrandlist: arr
          })
        }
        _this.upload(tempFilePaths,tag,e)
      },
    })
  },
  upload(filePath,tag,e){
    let _this=this;
    wx.uploadFile({
      url: _this.data.host + '/api-b/vipApply/uploadPicture?&fileSource=QINIUYUN&type=1&id=1',
      filePath: filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data" //记得设置
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'access_token': wx.getStorageSync('token')
      },
      success: function (res) {
        if(tag == "qualificationmapimg" || tag == "identityposimg" || tag == "identitynegimg" || tag == "handimage"){
          let obj=_this.data.form;
          obj[tag] = JSON.parse(res.data).data
          _this.setData({
            form:obj
          })
        } else if (tag == "taxpayerimg"){
          let str=""
          if(_this.data.form[tag]){
            str = _this.data.form[tag] + "@" + JSON.parse(res.data).data;
          }else{
            str = JSON.parse(res.data).data;
          }
          _this.setData({
            form:{
              ..._this.data.form,
              taxpayerimg:str
            }
          })

        }else{
          let arr = _this.data.formBrandlist.map((item, index) => {
            if (index == e.currentTarget.dataset.index) {
              item.resUrl = JSON.parse(res.data).data;
            }
            return item
          })
          _this.setData({
            formBrandlist: arr
          })
        }
        
      }
    })
  },
  //品牌选择
  canclesubscribe() {
    this.setData({
      hideModal: true
    })
  },
  subscribe() {
    this.setData({
      hideModal: true,
      formBrandlist: this.data.selectedbrandArr
    })
  },
  getSetType() {
    api.get("/api-g/goods-b/queryDictionarieList", {
      distinguish: 5,
      isable: 1
    }).then(res => {
      this.setData({
        options: res.data,
        defaultOption: res.data[0],
        form:{
          ...this.data.form,
          residencetype: res.data[0].id
        }
      })
    })
  },
  change(e){
    this.setData({
      selectedbrand: {},
      selectedbrandArr: [],
      formBrandlist: [],
      maxBrandLength: e.detail.id==1?1:5,
      form:{
        ...this.data.form,
        residencetype: e.detail.id,
      }
    })

    console.log(this.data.maxBrandLength)
  },
  getbrandlist() {
    api.get("/api-g/gods-anon/queryBrandHomePage").then(res => {
      let china = Object.values(res.data.china.result1).map(item => {
        return item[0]
      })
      let alphabet = Object.keys(res.data.base.result1)
      this.setData({
        alphabet: alphabet,
        china: china,
        brandlist: res.data.base.result1,
        oneitemlist: china
      })
    })
  },
  delRes(val) {
    let index = val.currentTarget.dataset.index;
    let arr = this.data.selectedbrandArr.splice(index + 1, 1)
    this.setData({
      selectedbrandArr: arr
    })
  },
  //选中品牌
  selectedBrand(val) {
    let obj = this.data.selectedbrand
    if (val.currentTarget.dataset.item.hasFactorySeller) {
      wx.showToast({
        icon: "none",
        title: '该品牌已被入驻',
      })
      return;
    }
    obj[val.currentTarget.dataset.item.id] = val.currentTarget.dataset.item
    if (Object.values(obj).length > this.data.maxBrandLength) {
      wx.showToast({
        icon: "none",
        title: '品牌不能超过' + this.data.maxBrandLength + "个",
      })
      return;
    }
    this.setData({
      selectedbrand: obj,
      selectedbrandArr: Object.values(obj)
    })
  },
  //切换字母列表
  tabAlphbet(val) {
    if (val.currentTarget.dataset.item == "china") {
      this.setData({
        oneitemlist: this.data.china,
        currenAlphabet: val.currentTarget.dataset.item
      })
    } else {
      this.setData({
        oneitemlist: this.data.brandlist[val.currentTarget.dataset.item],
        currenAlphabet: val.currentTarget.dataset.item
      })
    }
  },
  // 显示遮罩层 
  showModal: function() {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
      timingFunction: 'ease', //动画的效果 默认值是linear 
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画 
    }, 200)
  },

  // 隐藏遮罩层 
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
      timingFunction: 'ease', //动画的效果 默认值是linear 
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画 
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块 
  },

  //动画集 
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性 
    })
  },
  fadeDown: function() {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSetType();
    this.getbrandlist();
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