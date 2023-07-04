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
      if (!user.books) {
        user.books = [];
      }

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
      console.error(userId);
      const book = await this.repo.queryById(req.params.id);

      if (book && userId === book.user.id) {
        if (req.file) {
          book.image = {
            urlOriginal: req.file.path,
            url: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
          };
        }

        const modifyBook = await this.repo.update(req.params.id, req.body);
        res.status(201).send(modifyBook);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      console.error(userId);
      const book = await this.repo.queryById(req.params.id);

      if (book && userId === book.user.id) {
        await this.repo.delete(req.params.id);
        res.status(200).send(book);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
}
