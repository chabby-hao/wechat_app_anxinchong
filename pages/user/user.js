// pages/user/user.js
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    phone: '',
    shareData: {
      title: '安心充',
      desc: '安心充',
      path: '/pages/index/index'
    }
    //canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    console.log(app.globalData);
    this.setData({
      userInfo: app.globalData.userInfo,
      phone: app.globalData.phone,
    });
  },

  myWallet: function () {
    wx.navigateTo({
      url: '../wallet/wallet',
    })
  },

  myCharge: function () {
    wx.navigateTo({
      url: '../charge_history/charge_history',
    })
  },
  makePhoneCall: function () {
    var phone = '4006-855-788';
    var tel = '4006855788';
    wx.showModal({
      title: '拨打电话',
      content: '确认拨打电话' + phone + '吗？',
      success:function(res){
        if(res.confirm){
          var that = this
          wx.makePhoneCall({
            phoneNumber: tel,
            success: function () {
              console.log("成功拨打电话")
            }
          })
        }
      }
    })
    
  },

  logout:function(){
    app.globalData.isLogin = false;
    app.globalData.phone = null;
    app.globalData.userInfo = null;
    
    wx.reLaunch({
      url: '/pages/login/login',
    })

  },

  onShareAppMessage: function () {
    return this.data.shareData
  }
})