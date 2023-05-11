import CustomError from './errors/customError.js';

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
function wrapAsync(cb) {
  return async (req, res, next) => {
    try {
      return await cb(req, res, next);
    } catch (err) {
      // 傳到 app 的 error 來處理
      console.error('@wrapAsync Error', err);
      return next(new CustomError('Server Error', 500));
    }
  };
}

export default wrapAsync;
