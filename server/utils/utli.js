import moment from 'moment-timezone';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userProvider } from '../config/userProvider.js';

// convert to UTC
// 預設目前進來的時間都是Asia/Taipei
export function convertLocalToUTC(localTime, timezone = 'Asia/Taipei') {
  // 將本地時間解析為 Moment.js 對象
  const localDatetime = moment.tz(localTime, timezone);
  // 將本地時間轉換為 UTC 時間
  const utcDatetime = localDatetime.clone().utc();

  console.log('轉換後的時間,', utcDatetime.format('YYYY-MM-DD HH:mm:ss'));
  return utcDatetime;
}

// 取得現在時間
export function getNowTime() {
  // const dt0 = moment.utc().tz('UTC');
  return moment.utc().tz('UTC').format('YYYY-MM-DD HH:mm:ss');
}

export function calculateTime(inputTime, internalSeconds) {
  const interval = moment.duration(parseInt(internalSeconds, 10), 'seconds');
  const executeTime = moment(inputTime);
  return executeTime.clone().add(interval).format('YYYY-MM-DD HH:mm:ss');
}

// 確認為正整數(0-9)
export function validInteger(sting) {
  const regexNumber = /^[0-9]*$/;
  return regexNumber.test(sting);
}

export function validateUserProvider(inputProvide) {
  return userProvider.includes(inputProvide);
}

export function validateEmail(inputText) {
  // reference: https://www.w3schools.com/jsref/jsref_obj_regexp.asp
  // reference: https://www.geeksforgeeks.org/form-validation-using-html-javascript/
  const mailFormat = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/g;
  return mailFormat.test(inputText);
}

export function validatePassword(inputText) {
  // reference: https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
  // const pwdFormat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  // change to printable characters.
  const pwdFormat = /^[\x20-\x7E]{6,16}$/;
  return pwdFormat.test(inputText);
}

// 產生 hashPassword
export async function hashPassword(plaintextPassword) {
  // reference: https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
  const saltRounds = 10;
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
