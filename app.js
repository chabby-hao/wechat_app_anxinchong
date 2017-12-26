
var weixinLogin = require('utils/util.js').weixinLogin;
var checkToken = require('utils/util.js').checkToken;
var checkLogin = require('utils/util.js').checkLogin;
//app.js
App({
  onLaunch: function () {
    //checkToken(weixinLogin, checkLogin);
    var info = wx.getSystemInfoSync();
    console.log(info)
  },
  globalData: {
    token:null,
    isLogin:false,
    phone: null,
    userInfo:null
  }
})