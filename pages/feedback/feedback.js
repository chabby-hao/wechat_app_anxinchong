// pages/feedback/feedback.js
const app = getApp();
const serverUrl = require('../../config').serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  formSubmit: function (e) {
    console.log(e.detail);

    var token = app.globalData.token;
    var content = e.detail.value.content;

    if(!content){
      wx.showModal({
        title: '提示',
        content: '内容不能为空',
        showCancel:false,
      });
      return false;
    }

    var data = {token: token, content: content };
    wx.request({
      url: serverUrl + '/user/feedback',
      data: data,
      dataType: 'json',
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.code === 200) {
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel:false,
            success:function(){
              wx.navigateBack({
                
              });
            }
          })
        }
      }
    })
    console.log('form发生了submit事件，携带数据为：', e.detail)
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