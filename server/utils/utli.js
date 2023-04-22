import moment from 'moment-timezone';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import CustomError from './customError.js';

// 取得現在時間
export function getNowTime() {
  // const dt0 = moment.utc().tz('UTC');
  return moment.utc().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
}

export function calculateTime(inputTime, internalSeconds) {
  const interval = moment.duration(parseInt(internalSeconds, 10), 'seconds');
  const executeTime = moment(inputTime);
  const nextTime = executeTime
    .clone()
    .add(interval)
    .format('YYYY-MM-DD HH:mm:ss');
  return nextTime;
}

// 確認為正整數(0-9)
export function vaildInterger(sting) {
  const regexNumber = /^[0-9]*$/;
  return regexNumber.test(sting);
}

export function ValidateEmail(inputText) {
  // reference: https://www.w3schools.com/jsref/jsref_obj_regexp.asp
  // reference: https://www.geeksforgeeks.org/form-validation-using-html-javascript/
  const mailFormat = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/g;
  if (mailFormat.test(inputText)) {
    return true;
  }
  return false;
}

export function ValidatePassword(inputText) {
  // reference: https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
  const pwdFormat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (pwdFormat.test(inputText)) {
    return true;
  }
  return false;
}

// 處理密碼 reference: https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const saltRounds = 10;

// 產生 hashPassword
export async function hashPassword(plaintextPassword) {
  return bcrypt.hash(plaintextPassword, saltRounds);
}

// compare password
export async function comparePassword(plaintextPassword, hash) {
  return bcrypt.compare(plaintextPassword, hash);
}

// 產生JWT可寫為非同步
export function createJWT(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: Number(process.env.ACCESS_EXPIRED),
      },
      (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      }
    );
  });
}

export function verifyJWT(req, res, next) {
  console.log('@verifyJWT header', req.headers);
  if (!req.headers.authorization) {
    return next(new CustomError('No token', 401));
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.token = token;
    req.user = decoded;
    return next();
  } catch (err) {
    return next(new CustomError('Wrong token', 403));
  }
}
