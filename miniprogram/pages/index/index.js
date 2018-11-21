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
    showHeartbeat: true
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    this.reloadPage();
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
  reloadPage() {
    this.setBcgImg();
    this.getCityDatas();
    this.reloadInitSetting();
    this.reloadWeather();
    this.reloadGetBroadcast();
  },
  onReady: function() {
    //Do some when page ready.
  },
  onShow: function() {
    //Do some when page show.
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
  menuHide() {},
  getCityDatas() {},
  reloadInitSetting() {},
  reloadWeather() {
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
  reloadGetBroadcast() {},
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
    globalData.theme = img.topColor;
  },
  fnHideImgArea() {
    this.setData({
      bcgImgAreaShow: false
    });
  }
});
