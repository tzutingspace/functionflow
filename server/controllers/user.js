import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/customError.js';

import * as DBUser from '../models/user.js';

import {
  ValidateEmail,
  ValidatePassword,
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
    return next(
      new CustomError(
        '密碼請輸入6-16位數, 至少含有數字, 英文字母, 特殊符號(!@#$%^&*)各一',
        400
      )
    );
  }
  if (await DBUser.getUser(email)) {
    return next(new CustomError('Email已被註冊', 403));
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
    createResult,
  };
  return res.json({ data: output });
};
