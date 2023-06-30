import { Book } from '../entities/book.js';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { BookModel } from './book.mongo.model.js';
import { BookRepo } from './book.mongo.repository.js';
import { Image } from '../types/image.js';

jest.mock('./book.mongo.model');

describe('Given the BookRepo class', () => {
  const repo = new BookRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      BookModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      const result = await repo.query();
      expect(BookModel.find).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockSample = { id: '1' };
      const exec = jest.fn().mockResolvedValue(mockSample);
      BookModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.queryById('1');
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockSample);
    });

    test('Then the create method should be used', async () => {
      const mockSighting = {
        title: 'test',
        author: 'Asia',
        year: 1234,
        genre: 'Horror',
        synopsis: 'qwertyuiop',
        image: {} as Image,
        user: {} as User,
      } as unknown as Book;

      BookModel.create = jest.fn().mockReturnValueOnce(mockSighting);
      const result = await repo.create(mockSighting);
      expect(BookModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockSighting);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockSighting = { id: '1', title: 'test' };
      const updatedBook = { id: '1', title: 'test2' };
      const exec = jest.fn().mockResolvedValueOnce(updatedBook);
      BookModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockSighting);
      expect(BookModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });

    test('Then the search method should be used', async () => {
      const mockBook = [{ id: '1', title: 'test' }];

      const exec = jest.fn().mockResolvedValueOnce(mockBook);
      BookModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'title', value: 'test' });
      expect(BookModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      BookModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(BookModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and queryById method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new BookRepo();
      const error = new HttpError(
        404,
        'Not found',
        'No user found with this id'
      );
      const mockId = '1';

      const exec = jest.fn().mockResolvedValue(null);

      BookModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      await expect(repo.queryById(mockId)).rejects.toThrowError(error);
      expect(BookModel.findById).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and update method is called but the new user equals to null', () => {
    test('Then it should throw an error', async () => {
      const repo = new BookRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const mockBook = {} as Partial<Book>;

      const exec = jest.fn().mockResolvedValue(null);
      BookModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.update(mockId, mockBook)).rejects.toThrowError(error);
      expect(BookModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and delete method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new BookRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const exec = jest.fn().mockResolvedValueOnce(null);
      BookModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrowError(error);
      expect(BookModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
