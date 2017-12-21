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

// const checkToken = function (wxlogin, cklogin) {

//   var serverUrl = require('../config').serverUrl

//   var token = wx.getStorageSync('token');
//   console.log(token);
//   var app = getApp();
//   if (token) {
//     app.globalData.token = token;
//     wx.checkSession({
//       success: function () {
//         //session 未过期，并且在本生命周期一直有效
//         // wxlogin();

//         wx.request({
//           url: serverUrl + '/user/checkToken',
//           data: { token: token },
//           method: 'POST',
//           success: function (res) {
//             if (res.data.code == 200) {
//               //cklogin();
//             } else {
//               //wxlogin();
//               //cklogin();
//             }
//           },
//           fail: function () {
//             wxlogin();
//             //cklogin();
//           }
//         })


//       },
//       fail: function () {
//         //登录态过期
//         wxlogin();
//         //cklogin();
//       }
//     })
//   } else {
//     wxlogin();
//     cklogin();
//   }
// }

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
              wx.getUserInfo({
                success: function (res2) {
                  console.log('wxapi getuserinfo');
                  console.log(res2);
                  app.globalData.userInfo = res2.userInfo;
                }
              })
            } else {
              wxlogin();
              app.globalData.token = null;
              //token效验失败逻辑处理...
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
  if (url && url!='undefined') {
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
            app.globalData.deviceId = res.data.data.task_id;
            wx.navigateTo({
              url: '../charging/charging',
            })
          } else {
            wx.scanCode({
              success: function (res) {

                // wx.showModal({
                //   title: 'test',
                //   content: res.result,
                //   success:function(re2){
                //     if(re2.confirm){
                //       if (res.result == 'https://mp.weixin.qq.com/a/~~tuDIFev1Mmg~bqoemL9d3N9KlTD0w5qoQg~~'){
                //         wx.showToast({
                //           title: 'success',
                //         })
                //       }
                //     }
                //   }
                // })

                console.log(res.result);
                var obj = JSON.parse(res.result);
                console.log(obj);
                var deviceId = obj.device_id;
                wx.showModal({
                  title: res.scanType,
                  content: res.result,
                  showCancel: true,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../form/form?device_id=' + deviceId,
                      })
                    }
                  }
                })

              }
            })
          }
        }
      }
    })


  }
};


module.exports = {
  formatTime: formatTime,
  weixinLogin: weixinLogin,
  checkLogin: checkLogin,
  checkToken: checkToken,
  urlTo: urlTo,
  btScan:btScan,
}
