import axios from 'axios';
// import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/customError.js';

import * as DBUser from '../models/user.js';

import {
  ValidateEmail,
  ValidatePassword,
  comparePassword,
  hashPassword,
  createJWT,
} from '../utils/utli.js';

export const signup = async (req, res, next) => {
  console.log('@controller signup');
  const { name, email, password } = req.body;
  console.log('@signup request:', req.body);

  if (!req.is('application/json')) {
    return next(new CustomError('請使用正確content-type', 400));
  }
  if (!name || !email || !password) {
    return next(new CustomError('請提供完整資料(name, email, password)', 400));
  }
  if (!ValidateEmail(email)) {
    return next(new CustomError('Email格式錯誤', 400));
  }
  if (!ValidatePassword(password)) {
    return next(new CustomError('密碼請輸入6-16位數', 400));
  }
  if (await DBUser.getUser(email)) {
    return next(
      new CustomError('This email has already been registered.', 403)
    );
  }
  const hashResult = await hashPassword(password);
  // 記得處理非同步問題，if mysql errno===1062 要顯示已註冊(寫在async handler)
  const createResult = await DBUser.createUser(
    name,
    email,
    hashResult,
    'native'
  );
  delete createResult.password;
  const JWT = await createJWT(createResult);
  console.log('create JWT result:', JWT);
  const output = {
    access_token: JWT,
    access_expired: Number(process.env.ACCESS_EXPIRED),
    user: createResult,
  };
  return res.json({ data: output });
};

export const login = async (req, res, next) => {
  console.log('@controller signin');
  console.log('@controller signin request Body: ', req.body);
  if (!req.is('application/json')) {
    return next(new CustomError('請使用正確content-type', 400));
  }
  const { email, password, provider } = req.body;
  if (!provider || (provider !== 'native' && provider !== 'facebook')) {
    return next(
      new CustomError('請提供provider(僅接受native & facebook)', 400)
    );
  }
  let outputResult;
  if (provider === 'native') {
    // 1. 先檢查 email ＆ password 是否有輸入 //沒有驗證密碼是否符合規則
    if (!email || !password || !ValidateEmail(email)) {
      return next(new CustomError('Invalid email or password', 400));
    }
    // 2. 檢查是否有該用戶存在
    const user = await DBUser.getUser(email);
    console.log('native', user);
    if (!user) {
      return next(new CustomError('This email is not registered.', 403));
    }
    // 3. 確認密碼是否匹配
    const compareResult = await comparePassword(password, user.password);
    if (!compareResult) {
      console.log('確認有該用戶資料但密碼錯誤');
      return next(new CustomError('This Password is not correct!', 403));
    }
    // console.log('確認有該用戶資料且密碼正確', user);
    delete user.password;
    outputResult = user;
  }
  if (provider === 'facebook') {
    console.log('Facebook', req.body);
    const accessToken = req.body.access_token;
    if (!accessToken) {
      return next(new CustomError('facebook provider 請提供acces_token', 400));
    }
    const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email&version=v16.0`;
    const fbResponse = await axios.get(url);
    const fbUser = fbResponse.data;
    // check user exist our db
    const user = await DBUser.getUser(fbUser.email);
    if (user) {
      delete user.password;
      outputResult = user;
    } else {
      const createResult = await DBUser.createUser(
        fbUser.name,
        fbUser.email,
        'falsepassword',
        'facebook'
      );
      delete createResult.password;
      outputResult = createResult;
    }
  }

  const JWT = await createJWT(outputResult);
  // console.log('JWT result', JWT);
  const output = {
    access_token: JWT,
    access_expired: Number(process.env.ACCESS_EXPIRED),
    user: outputResult,
  };
  console.log('@loginResult', output);
  return res.json({ data: output });
};

export const getProfile = async (req, res) => {
  const result = req.user;
  console.log('@controller ID', result);
  delete result.iat;
  delete result.exp;
  // delete result.id;
  res.json({ data: result });
};
