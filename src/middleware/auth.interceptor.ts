import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { AuthServices } from '../services/auth.js';
import { BookRepo } from '../repository/book.mongo.repository.js';
import createDebug from 'debug';

const debug = createDebug('SFP:AuthInterceptor');

export class AuthInterceptor {
  // eslint-disable-next-line no-unused-vars
  constructor(private bookRepo: BookRepo) {
    debug('Instantiated');
  }

  logged(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      const token = authHeader.slice(7);
      const payload = AuthServices.verifyJWTGettingPayload(token);
      // Const decode:;

      req.body.tokenPayload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authorizedForBooks(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.tokenPayload) {
        throw new HttpError(
          401,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      }

      if (req.body.tokenPayload.id !== req.params.id) {
        throw new HttpError(498, 'Token not found', 'Invalid Token');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
