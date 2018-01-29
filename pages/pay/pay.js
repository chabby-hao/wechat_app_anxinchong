// pages/chongzhi/chongzhi.js
var serverUrl = require('../../config').serverUrl;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAmount: 0,
    defaultAmount: 10,
    disabled:false,
    img: '/image/xuanzhong@2x.png',//image/noxuanzhong@2x.png
    _num: 1,
  },

  xuanzhong:function(){
    if(this.data.disabled){
      this.setData({
        disabled:false,
        img:'/image/xuanzhong@2x.png',
      })
    }else{
      this.setData({
        disabled:true,
        img:'/image/noxuanzhong@2x.png',
      })
    }
  },

  intro: function(){
    wx.navigateTo({
      url: '/pages/pay_intro/pay_intro',
    })
  },

  // checkbox:function(e){
  //   console.log(e);
  //   if(e.detail.value.length>0){
  //     this.setData({
  //       disabled:false,
  //     })
  //   }else{
  //     this.setData({
  //       disabled:true,
  //     })
  //   }
  // },

  payChoose: function (obj) {
    var data = obj.currentTarget.dataset;
    var amount = data.amount;
    var _num = data.num;
    this.setData({
      currentAmount: amount,
      _num: _num,
    });
  },

  payNow: function () {

    console.log('tap pay button');
    var payamount = this.data.currentAmount;
    if(!payamount){
      return false;
    }

    wx.request({
      url: serverUrl + '/weixinPay/payJoinfee',
      method: 'POST',
      data: {
        token: app.globalData.token,
        order_amount: payamount,
      },
      success: function (res) {
        console.log(res);
        var payargs = res.data.data;
        //调起支付
        wx.requestPayment({
          timeStamp: payargs.timeStamp,
          nonceStr: payargs.nonceStr,
          package: payargs.package,
          signType: payargs.signType,
          paySign: payargs.paySign,
          success: function (res) {
            wx.redirectTo({
              url: '../wallet/wallet',
            })
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentAmount: this.data.defaultAmount
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