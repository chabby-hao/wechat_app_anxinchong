// pages/login/login.js

var weixinLogin = require('../../utils/util.js').weixinLogin;
var serverUrl = require('../../config').serverUrl;
var urlTo = require('../../utils/util.js').urlTo;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
  },

  getPhoneNumber: function (e) {
    console.log("weixin login ...");
    var that = this;
    wx.request({
      url: serverUrl + '/user/bindPhoneForWx',
      method: "POST",
      dataType: 'json',
      data: {
        detail: e.detail,
        token: app.globalData.token
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.code==200){
          app.globalData.isLogin = true;
          app.globalData.phone=res.data.data.phone;
          wx.getUserInfo({
            success: function (res2) {
              console.log(res2);
              app.globalData.userInfo = res2.userInfo;
            }
          })
          var url = that.data.url;
          urlTo(url, '../index/index');
        }
        
      }
    })
  },

  phoneLogin: function () {
    wx.navigateTo({
      url: '../register/register?url=' + this.data.url,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.url,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})