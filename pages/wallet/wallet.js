// pages/wallet/wallet.js
const serverUrl = require('../../config').serverUrl;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
    showRefund: false,
    hasRefund:false,
  },

  orderDetails: function () {
    console.log('order-details');
    wx.navigateTo({
      url: '../orders/orders',
    })
  },

  pay: function () {
    wx.navigateTo({
      url: '../pay/pay',
    })
  },

  discount:function(){
    wx.showModal({
      title: '提示',
      content: '敬请期待',
      showCancel:false,
    })
  },

  refund: function () {
    var token = app.globalData.token;
    var that = this;

    wx.showModal({
      title: '提示',
      content: '您的余额' + that.data.balance + '元，确定退款吗？',
      success: function (data) {
        if (data.confirm) {
          wx.request({
            url: serverUrl + '/user/refund',
            data: { token: token },
            success: function (res) {
              if (res.data.code === 200) {
                that.setData({
                  balance:'0.0',
                  hasRefund:true,
                  showRefund:false,
                })
                //退款提交成功
                wx.showToast({
                  title: '退款提交成功',
                })
              }
            }
          })
        } else {
          //取消退款
        }
      }
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
      data: { token: token },
      dataType: "json",
      success: function (res) {
        if (res.data.code == 200) {
          if (res.data.data.balance) {
            that.setData({
              balance: res.data.data.balance,
            })
            if(res.data.data.balance > 0){
              that.setData({
                showRefund: true,
              })
            }

          }
        }
      }
    })
    wx.request({
      url: serverUrl + '/user/hasRefund',
      data: { token: token },
      success: function (data) {
        if (data.data.code === 200) {
          if (data.data.data.has_refund === 1) {
            that.setData({
              hasRefund: true,
            });
          }
        }
      }
    })
  },

  refunding:function(){
    wx.showModal({
      title: '提示',
      content: '运营人员正在处理，退款成功会返回到您的微信账号中，请耐心等待',
      showCancel:false,
      confirmText:'知道了',
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