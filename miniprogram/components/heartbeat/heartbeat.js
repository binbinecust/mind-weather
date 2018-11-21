let utils = require('../../utils/utils');
let { systeminfo } = getApp().globalData;

//Component Object
Component({
  data: {
    arr: [],
    animations: [],
    lefts: [],
    tops: [],
    widths: [],
    duration: 4000
  },
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },
  data: {},
  methods: {
    dance(callback) {
      let { windowWidth, windowHeight } = systeminfo;
      let widths = [];
      let lefts = [];
      let tops = [];
      let animations = [];
      this.data.arr.forEach(item => {
        let animation = wx.createAnimation({
          duration: Math.random() * 2000 + 2000,
          timingFunction: 'linear',
          delay: 0
        });
        widths.push(Math.random() * 50 + 40);
        lefts.push(Math.random() * windowWidth);
        tops.push(-140);
        animation
          .top(windowHeight + 100)
          .left(Math.random() * windowWidth)
          .rotate(Math.random() * 960)
          .step();
        animations.push(animation.export());
      });
      this.setData({
        lefts,
        tops,
        widths
      });
      let timer = setTimeout(() => {
        this.setData({
          animations
        });
        // let toBack = setTimeout(
        //   function() {
        //     this.setData({
        //       arr: [],
        //       animations: [],
        //       lefts: [],
        //       tops: [],
        //       widths: []
        //     });
        //     clearTimeout(toBack);
        //   }.bind(this),
        //   4000
        // );
        clearTimeout(timer);
      }, 200);

      let end = setTimeout(() => {
        callback && callback();
        clearTimeout(end);
      }, 4000);
    }
  },
  created: function() {},
  attached: function() {},
  ready: function() {
    let arr = Array.from({ length: Math.random() * 20 + 20 }).map((v, i) => i);
    this.setData({
      arr
    });
  },
  moved: function() {},
  detached: function() {}
});
