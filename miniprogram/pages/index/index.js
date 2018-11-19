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
    userImg: '',
    cityDatas: '',
    weatherIconUrl: weatherIconUrl,
    bcgImgList: bcgImgList
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    this.reloadPage();
  },
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
  reloadWeather() {},
  reloadGetBroadcast() {}
});
