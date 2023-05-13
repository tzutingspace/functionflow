import { StatusCodes } from 'http-status-codes';
import CustomError from './customError.js';

class ServerError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default ServerError;
