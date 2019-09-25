// pages/my/components/mySeller/mySeller.js
import api from '../../../../api/api.js'
Component({
  options: {
    // multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    userDetail: {
      type: Object
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      this.drawProgressbg();
      this.drawCircle(1);
      this.getSellerDetail()
      console.log(this.data.userDetail)
    },
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {

    },
    hide: function() {},
    resize: function() {},
  },

  /**
   * 组件的初始数据
   */
  data: {
    progress_txt: "50%",
    sellerDetail: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    drawProgressbg: function() {
      // 使用 wx.createContext 获取绘图上下文 context
      var ctx = wx.createCanvasContext('canvasProgressbg', this)
      ctx.setLineWidth(4); // 设置圆环的宽度
      ctx.setStrokeStyle('#999'); // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath(); //开始一个新的路径
      ctx.arc(22.5, 22.5, 18.5, 0, 2 * Math.PI, false);
      //设置一个原点(22.5,22.5)，半径为100的圆的路径到当前路径
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function(step) {
      var context = wx.createCanvasContext('canvasProgress', this);
      // 设置渐变
      // var gradient = context.createLinearGradient(200, 100, 100, 200);
      // gradient.addColorStop("0", "#2661DD");
      // gradient.addColorStop("0.5", "#40ED94");
      // gradient.addColorStop("1.0", "#5956CC");
      context.setLineWidth(4);
      context.setStrokeStyle("#d5a260");
      context.setLineCap('round')
      context.beginPath();
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
      context.arc(22.5, 22.5, 18.5, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke();
      context.draw()
    },
    getSellerDetail() {
      // undiliver 代发货订单数
      // uncheck 代结算货款
      // noSelling 已下架商品
      // isSelling 在售商品
      api.get('/api-order/selllerCenter/querySellerCenterSummary', {}).then((res) => {
        console.log(res)
        this.setData({
          sellerDetail: res.data
        })
      })
    },
    orderManage() {
      wx.navigateTo({
        url: './myOrder/myOrder?params=' + 4,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    noseller() {
      wx.navigateTo({
        url: './myOrder/myOrder?params=' + 5,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    isseller() {
      wx.navigateTo({
        url: './myOrder/myOrder?params=' + 2,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    topUp() {
      wx.navigateTo({
        url: '../../../deposit/deposit',
      })
    },
    topupDetail() {
      wx.navigateTo({
        url: '../../../deposit/depositDetail/depositDetail',
      })
    }
  }
})