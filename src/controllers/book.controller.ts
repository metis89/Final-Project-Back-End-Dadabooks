import { NextFunction, Request, Response } from 'express';
import { BookRepo } from '../repository/book.mongo.repository.js';
import { Controller } from './controller.js';
import { Book } from '../entities/book.js';
import { PayloadToken } from '../services/auth.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import createDebug from 'debug';
const debug = createDebug('SFP:BookController');

export class BookController extends Controller<Book> {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: BookRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newBook = await this.repo.create(req.body);
      user.books.push(newBook);
      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newBook);
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      // Req.body.owner = userId;
      const modifyBook = await this.repo.update(req.params.id, req.body);
      // User.books.push(modifyBook);
      this.userRepo.update(user.id, user);

      res.status(202);
      res.send(modifyBook);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      const deleteBook = await this.repo.delete(req.params.id);
      this.userRepo.update(user.id, user);

      res.status(204);
      res.send(deleteBook);
    } catch (error) {
      next(error);
    }
  }
}
