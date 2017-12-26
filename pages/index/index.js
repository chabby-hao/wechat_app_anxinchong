
//index.js
//获取应用实例


const app = getApp()
var weixinLogin = require('../../utils/util.js').weixinLogin;
var checkToken = require('../../utils/util.js').checkToken;
var checkLogin = require('../../utils/util.js').checkLogin;
var btScan = require('../../utils/util.js').btScan;
var urlTo = require('../../utils/util.js').urlTo;
const serverUrl = require('../../config').serverUrl;
Page({
  data: {
    imageSrc: '/image/index@2x.png',//未充电 ,正在冲:'/image/charging@2x.png',
    timer:null,
  },

  onShow: function () {
    //检查是否正在充电
    var _this = this;
    clearInterval(_this.timer);
    _this.checkCharging();
    _this.timer = setInterval(function () {
      _this.checkCharging();
    }.bind(this), 2000);

  },

  checkFinish:function(finish){
    if(finish == 1){
      var token = wx.getStorageSync('token');
      wx.request({
        url: serverUrl + '/charge/lastFinish',
        data:{token:token},
        success:function(res){
          if(res.data.code===200){
            wx.showModal({
              title: '提示',
              content: res.data.data.content,
              showCancel:false,
            })
          }
        }
      })
    }
  },

  onHide: function(){
    clearInterval(this.timer);
  },

  checkCharging: function () {
    console.log('index checkCharging....');
    var that = this;
    if (app.globalData.isLogin) {
      var token = app.globalData.token;
      //登录
      wx.request({
        url: serverUrl + '/charge/taskId',
        data: { token: token },
        success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data.task_id) {
              app.globalData.taskId = res.data.data.task_id;
              that.setData({
                imageSrc: '/image/charging@2x.png'
              });
            } else {
              //未登录
              that.setData({
                imageSrc: '/image/index@2x.png'
              });
            }
          }
        }
      })
    }

  },

  onLoad: function (option) {
    this.checkFinish(option.finish);
    console.log('index onload...');
    checkToken(weixinLogin, checkLogin);

    wx.getUserInfo({
      success: function (res2) {
        console.log(res2);
        app.globalData.userInfo = res2.userInfo;
      }
    })

    var user = app.globalData;
    console.log(user);
  },

  btScan: function () {
    btScan();
  },

  btUser: function () {
    console.log(app.globalData);
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '../login/login?url=user',
      })
    } else {
      wx.navigateTo({
        url: '../user/user',
      })
    }
  },

  btHelp: function () {
    wx.navigateTo({
      url: '../help/help',
    })
  }

})
