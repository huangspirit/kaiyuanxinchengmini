// components/topNav/topNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    UserInforma: JSON.parse(wx.getStorageSync('UserInforma'))
  },
  attached: function() {
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    todetail(e){
      let val = e.currentTarget.dataset.target
      switch (val){
          case 'home':
            wx.switchTab({
              url: '/pages/home/home',
            });
            return;
          case 'search':
            wx.switchTab({
              url: '/pages/search/search',
            })
            return;
            case "shopCart":
              wx.switchTab({
                url: '/pages/shopCart/shopCart',
              })
              return;
            case "buyerOrder":
              wx.navigateTo({
                url: '/pages/center/buyer/buyerOrder/buyerOrder',
              })   
              return;
            case "push":
              wx.navigateTo({
                url: '/pages/releaseSale/releaseSale',
              });
              return;
            case "join":
              wx.navigateTo({
                url: '/pages/settle/settle',
              })
              return;
      }
    }
  }
})
