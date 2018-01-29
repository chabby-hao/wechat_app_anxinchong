
var weixinLogin = require('utils/util.js').weixinLogin;
var checkToken = require('utils/util.js').checkToken;
var checkLogin = require('utils/util.js').checkLogin;
const serverUrl = require('config').serverUrl;

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
    userInfo:null,
    checkActivity: false,//是否检测过活动，全局变量好判断
    cardId:0,//是否有福利卡,全局常量好判断
  }
})