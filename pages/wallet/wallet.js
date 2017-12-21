// pages/wallet/wallet.js
const serverUrl = require('../../config').serverUrl;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:'0.0',
  },

  orderDetails: function(){
    console.log('order-details');
    wx.navigateTo({
      url: '../orders/orders',
    })
  },

  pay:function(){
    wx.navigateTo({
      url: '../pay/pay',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('wallet');
    var that = this;
    var token = app.globalData.token;
    wx.request({
      url: serverUrl + '/user/balance',
      data:{token:token},
      dataType:"json",
      success:function(res){
        if(res.data.code==200){
          if(res.data.data.balance){
            that.setData({
              balance:res.data.data.balance
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
    console.log('refresh');
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