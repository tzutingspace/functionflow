import ConflictError from '../utils/errors/conflictError.js';
import BadRequestError from '../utils/errors/badRequestError.js';
import UnauthorizedError from '../utils/errors/unauthorizedError.js';

import * as DBUser from '../models/user.js';

import {
  validateUserProvider,
  validateEmail,
  validatePassword,
  comparePassword,
  hashPassword,
  createJWT,
} from '../utils/utli.js';

export const signup = async (req, res, next) => {
  console.debug('@controller signup');
  const { name, email, password, provider } = req.body;

  if (!req.is('application/json')) {
    return next(new BadRequestError('Please use the correct content-type.'));
  }

  if (!name || !email || !password || !provider) {
    return next(
      new BadRequestError(
        'Please provide complete information (name, email, password, provider).'
      )
    );
  }

  if (!validateUserProvider(provider)) {
    return next(new BadRequestError('Provider is not valid'));
  }

  if (!validateEmail(email)) {
    return next(new BadRequestError('Email is not valid'));
  }

  if (!validatePassword(password)) {
    return next(new BadRequestError('Password must be 6-16 characters'));
  }

  if (await DBUser.getUser(email)) {
    return next(new ConflictError('This email has already been registered.'));
  }

  const hashResult = await hashPassword(password);

  let createResult;
  try {
    createResult = await DBUser.createUser(name, email, hashResult, provider);
  } catch (err) {
    if (err.errno === 1062 && err.sqlState === '23000') {
      console.error('@signup controller, db has same email user', err);
      return next(new ConflictError('This email has already been registered.'));
    }
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
  console.debug('@controller login request Body: ', req.body);
  if (!req.is('application/json')) {
    return next(new BadRequestError('Please use the correct content-type.'));
  }

  const { email, password, provider } = req.body;

  if (!provider || !validateUserProvider(provider)) {
    return next(new BadRequestError('Please use the correct provider.'));
  }

  let outputResult;
  if (provider === 'native') {
    // 1. check email and password exist and validate email
    if (!email || !password || !validateEmail(email)) {
      return next(new BadRequestError('Invalid email or password'));
    }

    // 2. check user exist
    const user = await DBUser.getUser(email);
    if (!user) {
      return next(new UnauthorizedError('This email is not registered.'));
    }

    // 3. check password is correct
    const compareResult = await comparePassword(password, user.password);
    if (!compareResult) {
      console.debug('user input password is not correct.');
      return next(new UnauthorizedError('This Password is not correct!'));
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
