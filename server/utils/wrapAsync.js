import CustomError from './customError.js';

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
// function wrapAsync(fn) {
//   return function (req, res, next) {
//     // Make sure to `.catch()` any errors and pass them along to the `next()`
//     // middleware in the chain, in this case the error handler.
//     fn(req, res, next).catch(next);
//   };
// }

function wrapAsync(cb) {
  return async (req, res, next) => {
    try {
      return await cb(req, res, next);
    } catch (err) {
      console.log('錯誤訊息', err); // 在 server log 顯示的async/ await錯誤
      if (err.errno === 1062 && err.sqlState === '23000') {
        const errfeedback = new CustomError('Email已被註冊', 403); // 傳到 app 的 error 來處理
        return next(errfeedback);
      }
      const errfeedback = new CustomError('Server Error', 500); // 傳到 app 的 error 來處理
      return next(errfeedback);
    }
  };
}

export default wrapAsync;
