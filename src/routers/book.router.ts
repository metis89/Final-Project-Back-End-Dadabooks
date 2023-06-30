import { Router as createRouter } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { BookRepo } from '../repository/book.mongo.repository.js';
import { Repository } from '../repository/repository.js';
import { Book } from '../entities/book.js';
import { User } from '../entities/user.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { FileMiddleware } from '../middleware/files.js';

import createDebug from 'debug';
const debug = createDebug('W6:BookRouter');

debug('Executed');

const bookRepo: Repository<Book> = new BookRepo();
const userRepo: Repository<User> = new UserRepo();
const controller = new BookController(bookRepo, userRepo);
const auth = new AuthInterceptor(bookRepo);
export const bookRouter = createRouter();
const fileStore = new FileMiddleware();

bookRouter.get('/', controller.getAll.bind(controller));
bookRouter.get('/:id', controller.getById.bind(controller));

bookRouter.post(
  '/',
  fileStore.singleFileStore('image').bind(fileStore),
  auth.logged.bind(auth),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.post.bind(controller)
);
bookRouter.patch(
  '/:id',
  auth.logged.bind(auth),
  auth.authorizedForBooks.bind(auth),
  controller.patch.bind(controller)
);
bookRouter.delete(
  '/:id',
  auth.logged.bind(auth),
  auth.authorizedForBooks.bind(auth),
  // Controller.deleteById.bind(controller),
  controller.delete.bind(controller)
);
