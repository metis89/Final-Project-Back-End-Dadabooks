import { NextFunction, Request, Response } from 'express';
import { BookRepo } from '../repository/book.mongo.repository';
import { BookController } from './book.controller';
import { UserRepo } from '../repository/user.mongo.repository';

describe('Given an abstract Controller class', () => {
  describe('When its extended by BookController', () => {
    const mockRepoUser = {} as unknown as UserRepo;
    const mockRepo: BookRepo = {
      query: jest.fn().mockResolvedValue([]),
      queryById: jest.fn().mockResolvedValue({ books: [] }),
      search: jest.fn(),
      create: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      delete: jest.fn().mockResolvedValue([]),
    } as unknown as BookRepo;

    const req = {
      params: { id: 1 },
      body: { name: 'thing1', id: 1 },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    const controller = new BookController(mockRepo, mockRepoUser);

    test('Then method getAll should be used', async () => {
      await controller.getAll(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.query).toHaveBeenCalled();
    });

    test('Then method getByID should be used', async () => {
      await controller.getById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.queryById).toHaveBeenCalled();
    });

    // Test('Then method patch should be used', async () => {
    //   await controller.patch(req, res, next);
    //   // Expect(res.status).toHaveBeenCalledWith(201);
    //   expect(res.send).toHaveBeenCalled();
    //   expect(mockRepo.update).toHaveBeenCalled();
    // });

    test('Then method deleteById should be used', async () => {
      await controller.deleteById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalled();
    });
  });

  describe('When BookController is instantiated', () => {
    const mockUserRepo = {
      queryById: jest.fn(),
      update: jest.fn(),
    } as unknown as UserRepo;

    const mockBookRepo: BookRepo = {
      query: jest.fn().mockResolvedValue([]),
      queryById: jest.fn().mockResolvedValue({ books: [] }),
      search: jest.fn(),
      create: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      delete: jest.fn().mockResolvedValue([]),
    } as unknown as BookRepo;

    const req = {
      params: { id: '1' },
      body: { tokenPayload: {} },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    const controller = new BookController(mockBookRepo, mockUserRepo);

    test('Then the method post should be called', async () => {
      const userMock = {
        id: '1',
        books: [],
      };
      (mockUserRepo.queryById as jest.Mock).mockResolvedValueOnce(userMock);
      await controller.post(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockBookRepo.create).toHaveBeenCalled();
    });
  });

  describe('Error handlers', () => {
    const error = new Error('error');
    const mockRepoUser = {} as unknown as UserRepo;
    const mockRepo: BookRepo = {
      query: jest.fn().mockRejectedValue(error),
      queryById: jest.fn().mockRejectedValue(error),
      create: jest.fn().mockRejectedValue(error),
      update: jest.fn().mockRejectedValue(error),
      delete: jest.fn().mockRejectedValue(error),
    } as unknown as BookRepo;

    const req = {
      params: { id: 1 },
      body: { name: 'thing1', id: 2 },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    const controller = new BookController(mockRepo, mockRepoUser);

    test('getAll should handle errors', async () => {
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('getById should handle errors', async () => {
      await controller.getById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('post should handle errors', async () => {
      await controller.post(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    // Test('patch should handle errors', async () => {
    //   await controller.patch(req, res, next);
    //   expect(next).toHaveBeenCalledWith(error);
    // });

    test('deleteById should handle errors', async () => {
      await controller.deleteById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When the methods are called with errors', () => {
    const error = new Error('error');
    const mockUserRepo = {} as unknown as UserRepo;
    const mockBookRepo = {
      query: jest.fn().mockRejectedValue(error),
      queryById: jest.fn().mockRejectedValue(error),
      create: jest.fn().mockRejectedValue(error),
      update: jest.fn().mockRejectedValue(error),
      delete: jest.fn().mockRejectedValue(error),
    } as unknown as BookRepo;

    const newReq = {
      params: { id: '1' },
      body: { tokenPayload: {} },
    } as unknown as Request;
    const newRes = {
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const newController = new BookController(mockBookRepo, mockUserRepo);

    test('Then the getAll method should handle errors', async () => {
      await newController.getAll(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the getById method should handle errors', async () => {
      await newController.getById(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the post method should handle errors', async () => {
      await newController.post(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    // Test('Then the patch method should handle errors', async () => {
    //   await newController.patch(newReq, newRes, next);
    //   expect(next).toHaveBeenCalledWith(error);
    // });

    test('Then the deleteById method should handle errors', async () => {
      await newController.deleteById(newReq, newRes, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
