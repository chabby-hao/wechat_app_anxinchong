// pages/register/register.js
var serverUrl = require('../../config').serverUrl;
var urlTo = require('../../utils/util.js').urlTo;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    verify_code: '',
    buttonDisable: false,
    url:'',
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    if(e.detail.value.length >= 11){

    }
  },

  bindVerifyCodeInput: function (e) {
    this.setData({
      verify_code: e.detail.value
    })
  },

  sendVerifyCode:function(e){

    var that = this;
    var phone = that.checkPhone();
    if(!phone){
      return false;
    }

    var c = 60;
    
    var interrvalId = setInterval(function () {
      c = c - 1;
      that.setData({
        code_text: c + '后重发',
        buttonDisable: true,
      })
      console.log(that.data);
      if (c == 0) {
        clearInterval(interrvalId);
        that.setData({
          code_text: '获取验证码',
          buttonDisable: false,
        })
      }
    }, 1000);

    wx.request({
      url: serverUrl + "/user/sendMsgCode",
      dataType: 'jsonp',
      method: 'post',
      data: { phone: phone },
      success: function (res) {
        console.log(res)
      }
    })

  },

  login: function () {
    var that = this;
    //console.log(this.data);
    var phone = this.checkPhone();
    if(!phone){
      return false;
    }
    var verify_code = this.data.verify_code;
    var reg2 = /^\d{4}$/;
    
    if (!reg2.test(verify_code)) {
      wx.showToast({
        icon: 'loading',
        title: '验证码有误',
        duration:1000,
      })
      return false;
    }
    wx.request({
      url: serverUrl + '/user/login',
      method: "post",
      data: { phone: phone, verify_code: verify_code, token: app.globalData.token },
      success: function (res) {
        console.log(res);
        if(res.data.code==200){
          wx.getUserInfo({
            success: function (res2) {
              console.log(res2);
              app.globalData.userInfo = res2.userInfo;
            }
          })
          var url = that.data.url;
          urlTo(url, '../index/index');
        }else{
          //登录失败
          wx.showModal({
            title: '登录失败',
            content: '请检查验证码是否填写正确',
            showCancel:false
          })
        }
        
        // wx.navigateTo({
        //   url: '../index/index',
        // })
      }
    })
  },

  checkPhone: function(){
    var phone = this.data.phone;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    if (!reg.test(phone)) { //true
      wx.showToast({
        icon:'loading',
        title: '手机号有误',
        duration: 1000,
      });
      return false;
    }
    return phone;
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:options=options.url
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