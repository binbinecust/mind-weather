const cloud = require('wx-server-sdk');
cloud.init({
  env: 'development-75ee29'
});

// import { bcgImgList } from '../../miniprogram/data/common';

exports.main = async (event, context) => {
  return {
    title: (Math.round(Math.random() * 20901) + 19968).toString(16),
    path: '/pages/index/index',
    imageUrl: '../../img/asphalt-blue-sky-clouds-490411.jpg'
  };
};
