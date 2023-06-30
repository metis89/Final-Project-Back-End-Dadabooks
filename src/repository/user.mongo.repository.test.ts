import { User } from '../entities/user';
import { HttpError } from '../types/http.error';
import { UserModel } from './user.mongo.model';
import { UserRepo } from './user.mongo.repository';

jest.mock('./user.mongo.model.js');

describe('Given UserRepo Class', () => {
  describe('When I instantiate it', () => {
    const repo = new UserRepo();

    test('Then method query should be used', async () => {
      const exec = jest.fn().mockResolvedValueOnce([]);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.query();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('Then method queryById should have been called', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const exec = jest.fn().mockResolvedValueOnce({});
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.queryById(mockId);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    test('When queryByID fails due to wrong id, should throw HttpError', async () => {
      const mockId = '12345';
      const exec = jest.fn().mockResolvedValue(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec,
      });

      try {
        await repo.queryById(mockId);
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(404);
        expect(error.statusMessage).toBe('Not found');
        expect(error.message).toBe('Bad id for the query');
      }
    });

    test('Then method create should be used', async () => {
      const mockUser = {} as User;
      UserModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const result = await repo.create({} as Omit<User, 'id'>);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then method search should be user', async () => {
      const mockUser = { key: 'username', value: 'pepe' };
      const mockResult = [{ username: 'pepe', password: '1234' }];
      const exec = jest.fn().mockResolvedValue(mockResult);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await repo.search(mockUser);

      expect(UserModel.find).toHaveBeenCalledWith({
        [mockUser.key]: mockUser.value,
      });
      expect(result).toEqual(mockResult);
    });

    test('Then method update should update the user', async () => {
      const mockId = '12345';
      const mockData = { username: 'pepe', password: 'newPassword' };
      const mockUpdatedUser = { _id: mockId, ...mockData };
      const exec = jest.fn().mockResolvedValue(mockUpdatedUser);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await repo.update(mockId, mockData);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        mockData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedUser);
    });
    test('When update fails due to wrong id, should throw HttpError', async () => {
      const mockId = '12345';
      const mockData = { username: 'pepe', password: 'newPassword' };
      const exec = jest.fn().mockResolvedValue(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      try {
        await repo.update(mockId, mockData);
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(404);
        expect(error.statusMessage).toBe('Not found');
        expect(error.message).toBe('Bad id for the update');
      }
    });
  });
});
