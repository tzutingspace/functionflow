import { StatusCodes } from 'http-status-codes';
import CustomError from './customError.js';

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default NotFoundError;
