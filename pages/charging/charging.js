// pages/charging/charging.js
const app = getApp();
const serverUrl = require('../../config').serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    charging: true,
    mins: '0',//00
    minsClass: 'fenzhong-text',//fenzhong-text=分钟,ab-text=异常
    timeInterval: 0,
    wxCanvas: null,// 注意这里 需要创建一个对象来接受wxDraw对象
    animationData: {},
    animationData2: {},
    animationData3: {},
    animationData4: {},
    timer: null,
    modeText: "",
    priceText: "",
  },

  init: function () {
    clearInterval(this.data.timer);
    this.setData({
      timer: null,
      charging: true,
      mins: '0',
      minsClass: 'fenzhong-text',
    })
  },

  //异常中断
  ab: function () {
    this.setData({
      charging: false,
      mins: '异常停止',
      minsClass: 'ab-text',
    });
  },

  refresh: function () {
    var that = this;
    var timeInterval = that.data.timeInterval;
    var globalData = app.globalData;
    console.log(globalData);
    var token = globalData.token;
    var refreshMins = function () {
      wx.request({
        url: serverUrl + '/charge/chargingTime',
        data: { token: token },
        success: function (res) {
          if (res.data.code === 200) {
            //设置模式和价格
            that.setData({
              modeText: res.data.mode_text,
              priceText: res.data.price_text,
            });
            var state = res.data.data.status;
            console.log('charge state . ' + state);
            if (state === 0) {
              //充电中
              that.startCharging(that);//里面播放充电动作
              var mins = res.data.data.mins;
              that.setData({
                'mins': mins
              });
            } else if (state === 1) {
              that.ab();
              //异常中断，跳页面
              // wx.redirectTo({
              //   url: '../charge_ab/charge_ab',
              // });
              //clearInterval(timeInterval);
            } else if (state === 2) {
              //充电完成
              var taskId = res.data.data.task_id;
              clearInterval(timeInterval);
              wx.reLaunch({
                url: '../index/index?finish=1',
              })
            } else if (state === 3) {
              //初始化任务，但还未通电
            }

          }
        }
      })
    }
    timeInterval = setInterval(function () {
      refreshMins();
    }, 2000);
    refreshMins();
    that.setData({
      timeInterval: timeInterval,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //that.startCharging(that);
  },

  startCharging: function (that) {
    if (that.timer) {
      return;
    }
    clearInterval(that.timer);
    that.timer = setInterval(function () {
      if (this.data.charging) {
        that.animate.call(that, 0, 1);
        that.animate.call(that, 250, 2);
        that.animate.call(that, 500, 3);
        that.animate.call(that, 750, 4);
      }
    }.bind(this), 3000);
  },

  animate: function (delay, type) {
    console.log('begin 动画...');
    var animation = wx.createAnimation({
      delay: delay
    });
    animation.opacity(0.7).scale(1.3, 1.3).step({
      duration: 1000
    });
    animation.opacity(0).scale(1.5, 1.5).step({
      delay: 0,
      duration: 1000
    });

    if (type == 1) {
      var data = {
        animationData: animation.export()
      }
    } else if (type == 2) {
      var data = {
        animationData2: animation.export()
      }
    } else if (type == 3) {
      var data = {
        animationData3: animation.export()
      }
    } else {
      var data = {
        animationData4: animation.export()
      }
    }
    this.setData(data)

    setTimeout(function () {
      animation.scale(1, 1).step({
        delay: 0,
        duration: 0
      });

      if (type == 1) {
        var data = {
          animationData: animation.export()
        }
      } else if (type == 2) {
        var data = {
          animationData2: animation.export()
        }
      } else if (type == 3) {
        var data = {
          animationData3: animation.export()
        }
      } else {
        var data = {
          animationData4: animation.export()
        }
      }
      this.setData(data)
    }.bind(this), 2000 + delay)
  },

  stopCharge: function () {
    var deviceId = app.globalData.deviceId;
    var taskId = app.globalData.taskId;
    wx.showModal({
      title: '结束',
      content: '您真的要停止充电吗？',
      success: function (res) {
        if (res.confirm) {
          //点击确定按钮
          //调用停止充电
          wx.request({
            url: serverUrl + '/charge/chargeEnd',
            data: { device_id: deviceId,task_id:taskId },
            success: function (res2) {
              if (res2.data.code == 200) {
                wx.reLaunch({
                  url: '../index/index?finish=1',
                })
              }
            }
          })
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
    this.init();
    this.refresh();
    var token = app.globalData.token;
    var that = this;
    wx.request({
      url: serverUrl + '/charge/chargeMode',
      data:{token:token},
      success:function(res){
        if(res.data.code===200){
          that.setData({
            modeText:res.data.data.mode_text,
            priceText:res.data.data.price_text,
          });
        }
      }
    })
  },

  feedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timeInterval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var time = this.data.timeInterval;
    console.log(time);
    clearInterval(time);
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