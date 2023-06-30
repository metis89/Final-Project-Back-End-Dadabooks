import { BookModel } from './book.mongo.model.js';
import createDebug from 'debug';
import { Book } from '../entities/book.js';
import { Repository } from './repository.js';
import { HttpError } from '../types/http.error.js';
const debug = createDebug('SFP:BookRepo');

export class BookRepo implements Repository<Book> {
  constructor() {
    debug('Instantiated', BookModel);
  }

  async query(): Promise<Book[]> {
    const aData = await BookModel.find().populate('user', { books: 0 }).exec();
    return aData;
  }

  async queryById(id: string): Promise<Book> {
    const result = await BookModel.findById(id)
      .populate('user', { books: 0 })
      .exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the query');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Book[]> {
    const result = await BookModel.find({ [key]: value })
      .populate('user', { books: 0 })
      .exec();
    return result;
  }

  async create(data: Omit<Book, 'id'>): Promise<Book> {
    const newBook = await BookModel.create(data);
    return newBook;
  }

  async update(id: string, data: Partial<Book>): Promise<Book> {
    const newBook = await BookModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('owner', { books: 0 })
      .exec();
    if (newBook === null)
      throw new HttpError(404, 'Not found', 'Bad id for the update');
    return newBook;
  }

  async delete(id: string): Promise<void> {
    const result = await BookModel.findByIdAndDelete(id).exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the delete');
  }
}
