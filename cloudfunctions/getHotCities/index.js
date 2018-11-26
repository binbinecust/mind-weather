// const cloud = require('wx-server-sdk');
// cloud.init();
// const db = cloud.database({
//   env: 'development-75ee29'
// });
// debugger;
// exports.main = async (event, context) => {
//   return db.collection('hotCities').get();
// };

const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({
  env: 'development-75ee29'
});
exports.main = async (event, context) => {
  return db.collection('hotCities').get();
};

// exports.main = (event, context) => {
//   console.log(event)
//   console.log(context)
//   return {
//     sum: event.a + event.b
//   }
// }
