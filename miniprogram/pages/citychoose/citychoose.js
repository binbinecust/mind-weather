const oCitys = require('../../data/staticData');

Page({
  data: {
    showItems: [],
    bgcolor: '',
    inputText: '',
    hotCities: []
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    let themeColor = wx.getStorageSync('themeColor');
    this.setColor(themeColor);
  },
  setColor(color) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    });
    this.setData({
      bgcolor: color
    });
  },
  formatCitys: function(filterVal = '') {
    let citys = JSON.parse(JSON.stringify(oCitys.cities));
    citys = citys.filter(item => item.name.includes(filterVal));
    citys.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1;
      } else if (a.letter < b.letter) {
        return -1;
      } else {
        return 0;
      }
    });
    citys = citys.reduce((acc, curv) => {
      let index = acc.findIndex(item => item.key === curv.letter);
      if (index === -1) {
        acc.push({ key: curv.letter, values: [curv.name] });
      } else {
        acc[index].values.push(curv.name);
      }
      return acc;
    }, []);
    return citys;
  },
  inputFilter: function(e) {
    let value = e.detail.value;
    this.setData({
      showItems: this.formatCitys(value)
    });
  },
  cancel() {
    this.setData({
      inputText: '',
      showItems: this.formatCitys()
    });
  },
  getHotCities() {
    wx.cloud
      .callFunction({
        name: 'getHotCities',
        data: {}
      })
      .then(res => {
        let data = res.result.data[0].cities;
        if (data) {
          this.setData({
            hotCities: data
          });
        }
      });
  },
  choose(e) {
    wx.navigateTo({
      url: `/pages/index/index?search=${e.currentTarget.dataset.name}`
    });
  },
  onReady: function() {
    //Do some when page ready.
    this.setData({
      showItems: this.formatCitys()
    });
    this.getHotCities();
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
  }
});
