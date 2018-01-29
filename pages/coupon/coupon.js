// pages/coupon/coupon.js
const app = getApp();
const serverUrl = require('../../config').serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = app.globalData.token;
    var that = this;
    wx.request({
      url: serverUrl + '/user/cardsList',
      data: { token: token },
      success: function (res) {
        if (res.data.code === 200) {
          if(res.data.data.length){
            that.setData({
              lists:res.data.data,
            })
          }
        }
      }
    })
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