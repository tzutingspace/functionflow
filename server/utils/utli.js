import moment from 'moment-timezone';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userProvider } from '../config/userProvider.js';

// Asia/Taipei convert to UTC
export function convertLocalToUTC(localTime, timezone = 'Asia/Taipei') {
  // localTime to Moment.js
  const localDatetime = moment.tz(localTime, timezone);
  const utcDatetime = localDatetime.clone().utc();

  console.debug('轉換後的時間,', utcDatetime.format('YYYY-MM-DD HH:mm:ss'));
  return utcDatetime;
}

export function getNowTime() {
  // const dt0 = moment.utc().tz('UTC');
  return moment.utc().format('YYYY-MM-DD HH:mm:ss');
}

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

export async function hashPassword(plaintextPassword) {
  // reference: https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
  const saltRounds = 10;
  return bcrypt.hash(plaintextPassword, saltRounds);
}

export async function comparePassword(plaintextPassword, hash) {
  return bcrypt.compare(plaintextPassword, hash);
}

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
