// pages/orders/orders.js
var serverUrl = require('../../config').serverUrl;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: serverUrl + "/orders/lists",
      data:{token:app.globalData.token},
      success: function(res){
        if(res.data.code==200){
          var lists = res.data.data;
          if(lists.length == 0){
            wx.redirectTo({
              url: '../no_orders/no_orders',
            })
          }else{
            that.setData({
              list:lists,
            })
          }
          console.log(lists);
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