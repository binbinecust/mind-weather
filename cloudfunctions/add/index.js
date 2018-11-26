// exports.main = (event, context) => {
//   return {
//     total: event.a + event.b
//   };
// };

exports.main = (event, context) => {
  console.log(event);
  console.log(context);
  return {
    add: event.a + event.b
  };
};
