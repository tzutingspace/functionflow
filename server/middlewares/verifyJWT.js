import jwt from 'jsonwebtoken';

import CustomError from '../utils/customError.js';

export function verifyJWT(req, res, next) {
  console.log('@verifyJWT');
  // console.log('@verifyJWT header', req.headers);
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
