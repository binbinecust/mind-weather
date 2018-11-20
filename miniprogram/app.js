//app.js
import moment from 'moment';

App({
  onLaunch: function() {
    let _this = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'envid',
        traceUser: true
      });
      wx.getSystemInfo({
        success: function(res) {
          _this.globalData.systeminfo = res;
          _this.globalData.isIPhoneX = /iphonex/gi.test(res.model.replace(/\s+/, ''));
        }
      });
    }
    wx.getUserInfo({
      success: function(res) {
        _this.globalData.userInfo = res;
      }
    });
    moment.locale('zh-cn');
    wx.moment = moment;
  },
  globalData: {
    isIPhoneX: false,
    themeColor: '#393836',
    systeminfo: {},
    key: '7b49c6c1608f4ef4ab3e5482b5677995',
    weatherIconUrl: 'https://cdn.heweather.com/cond_icon/',
    requestUrl: {
      weather: 'https://free-api.heweather.com/s6/weather',
      hourly: 'https://free-api.heweather.com/s6/weather/hourly'
    },
    userInfo: {}
  }
});
