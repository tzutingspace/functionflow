import { StatusCodes } from 'http-status-codes';
import CustomError from './customError.js';

class ConflictError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default ConflictError;
