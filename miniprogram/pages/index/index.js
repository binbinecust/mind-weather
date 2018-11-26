//index.js
let globalData = getApp().globalData;
let utils = require('../../utils/utils');
let { systeminfo, key, isIPhoneX, weatherIconUrl } = globalData;
import { lifestyles, detailsDic, bcgImgList } from '../../data/common';

Page({
  data: {
    isIPhoneX: isIPhoneX,
    message: '',
    bcgImg: '',
    bcgColor: '',
    bcgIndex: 0,
    city: '',
    cityDatas: '',
    located: '',
    weatherIconUrl: weatherIconUrl,
    bcgImgList: bcgImgList,
    bcgImgAreaShow: false,
    activeIndex: 0,
    detailsDic: detailsDic,
    enableSearch: false,
    showHeartbeat: true,
    shareInfo: '',
    isPoped: false,
    animationOne: {},
    animationTwo: {},
    animationThree: {},
    animationFour: {},
    animationMain: {},
    setting: {}
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    this.reloadPage(options.search);
  },
  initWeather(location) {},
  setBcgImg(index = 0) {
    let color = bcgImgList[index].topColor;
    this.setData({
      bcgImg: bcgImgList[index].src,
      bcgColor: color,
      bcgIndex: index
    });
    globalData.theme = color;
    this.setNavigationBarColor();
    wx.setStorageSync('themeColor', color);
  },
  setNavigationBarColor() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: globalData.theme
    });
  },
  getCityDatas() {
    let cityDatas = wx.getStorage({
      key: 'cityDatas',
      success: res => {
        this.setData({
          cityDatas: res.data
        });
      }
    });
  },
  fnConfirmSearch(e) {
    let location = e.detail.value.trim();
    if (location === '520' || location === '521') {
      this.setData({
        city: ''
      });
      this.dance();
      return;
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    this.getWeather(location);
    this.getHourly(location);
  },
  dance() {
    this.setData({
      enableSearch: true
    });
    let heartbeat = this.selectComponent('#heartbeat');
    heartbeat.dance(() => {
      this.setData({
        showHeartbeat: false,
        enableSearch: false
      });
      this.setData({
        showHeartbeat: true
      });
    });
  },
  reloadPage(location) {
    this.setBcgImg();
    this.getCityDatas();
    this.reloadInitSetting();
    this.reloadWeather(location);
    this.reloadGetBroadcast();
  },
  onReady: function() {
    //Do some when page ready.
  },
  onShow: function() {
    //Do some when page show.
    wx.cloud
      .callFunction({
        name: 'getShareInfo'
      })
      .then(res => {
        console.log(res);
        let shareInfo = res.result;
        this.setData({
          shareInfo: shareInfo
        });
      });
  },
  onHide: function() {
    //Do some when page hide.
  },
  onUnload: function() {
    //Do some when page unload.
  },
  onPullDownRefresh: function() {
    //Do some when page pull down.
  },
  onShareAppMessage(res) {
    let shareInfo = this.data.shareInfo;
    console.log(shareInfo);
    return shareInfo;
  },
  menuHide() {},
  getCityDatas() {},

  reloadInitSetting() {
    wx.getStorage({
      key: 'setting',
      success: res => {
        let setting = res.data;
        this.setData({
          setting: res.data
        })
        if (!setting.forceUpdate || !wx.getUpdateManager()){
          return;
        }
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate((result) => {
          console.info(res);
        });
        updateManager.onUpdateReady((result) => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经下载完成，是否重启应用？',
            success: (res) => {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          })
        });
      }
    })
  },
  reloadWeather(location) {
    if (location) {
      this.getWeather(location);
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          this.getWeather(`${res.latitude},${res.longitude}`);
          this.getHourly(`${res.latitude},${res.longitude}`);
        },
        fail: err => {
          if (err.errMsg.indexOf('deny') !== -1 || err.errMsg.indexOf('denied') !== -1) {
            wx.showToast({
              title: '需要开启地址位置权限',
              icon: 'none',
              duration: 2500,
              success: res => {
                if (wx.canIUse('openSetting')) {
                  wx.openSetting({
                    success: res => {
                      debugger;
                    }
                  });
                }
              }
            });
          } else {
            wx.showToast({
              title: '网络不给力，请稍后再试',
              icon: 'none'
            });
          }
        }
      });
    }
    if (this.data.located) {
      this.initWeather();
    }
  },
  getWeather(location) {
    wx.request({
      url: `${globalData.requestUrl.weather}`,
      data: {
        location,
        key
      },
      success: res => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0];
          if (data.status === 'ok') {
            data.updateTimeFormat = wx.moment().format('MM-DD HH:mm');
            this.setData({
              city: '',
              cityDatas: data
            });
            wx.setStorage({
              key: 'cityDatas',
              data: data
            });
          }
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          });
        }
        console.log(res);
      },
      fail: err => {}
    });
  },
  getHourly(location) {
    wx.request({
      url: `${globalData.requestUrl.hourly}`,
      data: {
        location,
        key
      },
      success: res => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0];
          if (data.status === 'ok') {
            this.setData({
              hourlyDatas: data.hourly || []
            });
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        });
      }
    });
  },
  reloadGetBroadcast() {
    this.getBroadCast(message => {
      this.setData({
        message: message
      })
    })
  },
  getBroadCast(callback) {
    wx.cloud.callFunction({
      name: 'broadcast',
      hour: wx.moment().hour()
    }).then(res => {
      callback && callback(res.message);
    }).catch(e => {})
  },
  fnShowImgArea() {
    this.setData({
      bcgImgAreaShow: true
    });
  },
  fnChooseBgImg(e) {
    let { img, index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index,
      bcgImg: img.src
    });
    wx.setStorage({
      key: 'themeColor',
      data: `${img.topColor}`
    });
    globalData.theme = img.topColor;
  },
  fnHideImgArea() {
    this.setData({
      bcgImgAreaShow: false
    });
  },
  fnToCitychoosePage() {
    wx.navigateTo({
      url: '/pages/citychoose/citychoose'
    });
  },
  menuMain(e) {
    if (this.data.isPoped) {
      this.retract();
    } else {
      this.scatter();
    }
  },
  scatter() {
    let animationMain = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 0
    });
    let animationOne = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 0
    });
    let animationTwo = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 0
    });
    let animationThree = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 0
    });
    let animationFour = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 0
    });
    animationMain.rotate(720).step();
    animationOne
      .translate(0, -60)
      .rotate(720)
      .opacity(1)
      .step();
    animationTwo
      .translate(-52, -30)
      .rotate(720)
      .opacity(1)
      .step();
    animationThree
      .translate(-52, 30)
      .rotate(720)
      .opacity(1)
      .step();
    animationFour
      .translate(0, 60)
      .rotate(720)
      .opacity(1)
      .step();

    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export(),
      isPoped: true
    });
  },
  retract() {
    let animationMain = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    let animationOne = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    let animationTwo = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    let animationThree = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    let animationFour = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    [animationOne, animationTwo, animationThree, animationFour].forEach(item => {
      item
        .translate(0, 0)
        .rotate(0)
        .opacity(0)
        .step();
    });
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export(),
      isPoped: false
    });
  },
  menuToSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting'
    })
  },
  menuToCitychoose() {},
  menuToAbout() {}
});
