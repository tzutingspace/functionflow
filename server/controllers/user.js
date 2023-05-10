import CustomError from '../utils/errors/customError.js';
import BadRequestError from '../utils/errors/badRequestError.js';
import UnauthorizedError from '../utils/errors/unauthorizedError.js';

import * as DBUser from '../models/user.js';

import {
  ValidateEmail,
  ValidatePassword,
  comparePassword,
  hashPassword,
  createJWT,
} from '../utils/utli.js';

export const signup = async (req, res, next) => {
  console.debug('@controller signup');
  const { name, email, password } = req.body;

  if (!req.is('application/json')) {
    return next(new BadRequestError('Please use the correct content-type.'));
  }

  if (!name || !email || !password) {
    return next(
      new BadRequestError(
        'Please provide complete information (name, email, password).'
      )
    );
  }

  if (!ValidateEmail(email)) {
    return next(new BadRequestError('Email is not valid'));
  }

  if (!ValidatePassword(password)) {
    return next(new BadRequestError('Password must be 6-16 characters'));
  }

  if (await DBUser.getUser(email)) {
    return next(
      new UnauthorizedError('This email has already been registered.')
    );
  }

  const hashResult = await hashPassword(password);
  // 記得處理非同步問題，if mysql errno===1062 要顯示已註冊(寫在async handler)
  let createResult;
  try {
    createResult = await DBUser.createUser(name, email, hashResult, 'native');
  } catch (err) {
    console.error('error', err);
    if (err.errno === 1062 && err.sqlState === '23000') {
      return next(
        new UnauthorizedError('This email has already been registered.')
      );
    }
    return next(new CustomError('Server Error'), 500);
  }
  delete createResult.password;
  const JWT = await createJWT(createResult);
  console.debug('create JWT result:', JWT);
  const output = {
    access_token: JWT,
    access_expired: Number(process.env.ACCESS_EXPIRED),
    user: createResult,
  };
  return res.json({ data: output });
};

export const login = async (req, res, next) => {
  console.debug('@controller login');
  console.debug('@controller login request Body: ', req.body);
  if (!req.is('application/json')) {
    return next(new BadRequestError('Please use the correct content-type.'));
  }

  const { email, password, provider } = req.body;

  if (!provider || provider !== 'native') {
    return next(
      new BadRequestError(
        'Please provide the provider (only accept native).',
        400
      )
    );
  }

  let outputResult;
  if (provider === 'native') {
    // 1. check email and password exist and validate email
    if (!email || !password || !ValidateEmail(email)) {
      return next(new CustomError('Invalid email or password', 400));
    }

    // 2. check user exist
    const user = await DBUser.getUser(email);
    if (!user) {
      return next(new CustomError('This email is not registered.', 403));
    }

    // 3. check password is correct
    const compareResult = await comparePassword(password, user.password);
    if (!compareResult) {
      console.debug('user input password is not correct.');
      return next(new CustomError('This Password is not correct!', 403));
    }
    delete user.password;
    outputResult = user;
  }

  const JWT = await createJWT(outputResult);
  const output = {
    access_token: JWT,
    access_expired: Number(process.env.ACCESS_EXPIRED),
    user: outputResult,
  };
  return res.json({ data: output });
};

export const getProfile = async (req, res) => {
  const result = req.user;
  delete result.iat;
  delete result.exp;
  res.json({ data: result });
};
