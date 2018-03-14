const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const weixinLogin = function () {
  var app = getApp();
  var serverUrl = require('../config').serverUrl
  wx.login({
    success: function (res) {
      var code = res.code;
      wx.request({
        url: serverUrl + '/user/loginByCode',
        method: "POST",
        dataType: 'json',
        data: {
          code: res.code,
        },
        success: function (res2) {
          if (res2.data.code == 200) {
            //登录成功
            var data = res2.data.data;
            var token = data.token;
            app.globalData.token = token;
            if (res2.data.data.phone) {
              app.globalData.phone = res2.data.data.phone;
              app.globalData.isLogin = true;

              getCard();
            }
            if (app.globalData.cardId && !app.globalData.isLogin) {
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }

            wx.setStorage({
              key: 'token',
              data: token,
              success: function (res3) {
                console.log('save token success:' + token);
              }
            })
          }
        }
      })
    }
  })
};

const checkToken = function (wxlogin) {
  var serverUrl = require('../config').serverUrl

  var token = wx.getStorageSync('token');
  console.log(token);
  var app = getApp();
  if (token) {
    app.globalData.token = token;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        //验证登录
        wx.request({
          url: serverUrl + '/user/checkToken',
          data: { token: token },
          method: 'POST',
          success: function (res) {
            if (res.data.code == 200) {
              app.globalData.phone = res.data.data.phone;
              app.globalData.isLogin = true;
              getCard();
              wx.getUserInfo({
                success: function (res2) {
                  console.log('wxapi getuserinfo');
                  console.log(res2);
                  app.globalData.userInfo = res2.userInfo;
                }
              })
            } else {
              //token效验失败逻辑处理...
              app.globalData.token = null;
              wxlogin();
            }
          },
        })
      },
      fail: function () {
        //seesion过期
        app.globalData.token = token;
        wxlogin();
      }
    });


  } else {
    //token不存在 
    wxlogin();
  }
}

const getCard = function () {
  var app = getApp();
  var token = app.globalData.token;
  var card = app.globalData.cardId;
  if (token && card) {
    wx.request({
      url: serverUrl + '/activity/getCard',
      data: { token: token, card: card },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: res.data.data.toast,
            showCancel: false,
            confirmText: '前往充电',
            success:function(res){
              if(res.confirm){
                btScan();
              }
            }
          })
        }else if(res.data.code==2018){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel:false,
          })
        }
      }
    })
  }

}

const checkLogin = function () {
  var serverUrl = require('../config').serverUrl
  var token = wx.getStorageSync('token');
  var app = getApp();

  if (token) {
    wx.request({
      url: serverUrl + '/user/checkLogin',
      data: {
        token: token
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          //已登录状态

          if (app.globalData.cardId) {
            wx.showModal({
              title: '提示',
              content: '',
            })
          }

          app.globalData.phone = res.data.data.phone;
          app.globalData.isLogin = true;
          wx.getUserInfo({
            success: function (res2) {
              console.log('get user info');
              console.log(res2);
              app.globalData.userInfo = res2.userInfo;
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
}

const urlTo = function (url, defaultUrl) {
  if (url && url != 'undefined') {
    wx.redirectTo({
      url: '../' + url + '/' + url,
      success: function () {
        if (url == 'index') {
          btScan();
        }
      }
    })
  } else {
    wx.reLaunch({
      url: defaultUrl,
    })
  }
}

const serverUrl = require('../config').serverUrl;

const btScan = function () {
  var app = getApp();
  console.log(app.globalData);
  if (!app.globalData.isLogin) {
    wx.navigateTo({
      url: '../login/login?url=index',
    })
  } else {
    var token = app.globalData.token;
    wx.request({
      url: serverUrl + '/charge/taskId',
      data: { token: token },
      success: function (res) {
        if (res.data.code == 200) {
          if (res.data.data.task_id) {
            app.globalData.taskId = res.data.data.task_id;
            wx.navigateTo({
              url: '../charging/charging',
            })
          } else {
            wx.scanCode({
              success: function (res) {
                var url = res.result;
                console.log(res.result);

                wx.request({
                  url: serverUrl + '/charge/checkQrCode',
                  data: { url: url, token: token },
                  success: function (res2) {
                    errCheck(res2);
                    if (res2.data.code === 200) {
                      var deviceId = res2.data.data.device_id;
                      wx.navigateTo({
                        url: '../form/form?device_id=' + deviceId,
                      })
                    }
                  },
                })



              }
            })
          }
        }
      }
    })


  }
};

const errCheck = function (res) {
  if (res.data.code !== 200 && res.data.msg) {
    wx.showModal({
      title: '提示',
      content: res.data.msg,
      //showCancel:false,
      success: function (res2) {
        if (res2.confirm) {
          if (res.data.code == 2009) {
            //余额不足
            wx.navigateTo({
              url: '/pages/pay/pay',
            });
          }
        }
      }
    })
  }
}


module.exports = {
  formatTime: formatTime,
  weixinLogin: weixinLogin,
  checkLogin: checkLogin,
  checkToken: checkToken,
  urlTo: urlTo,
  btScan: btScan,
  errCheck: errCheck,
}
