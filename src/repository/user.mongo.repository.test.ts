import { UserModel } from './user.mongo.model.js';
import { UserRepo } from './user.mongo.repository.js';

jest.mock('./user.mongo.model');
describe('Given the UserRepo class', () => {
  const repo = new UserRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      // Arrange
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });

      // Act
      const result = await repo.query();

      // Assert
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      // Arrange
      const mockId = '1';
      const mockUser = {
        id: '1',
        userName: 'Ernestina',
        email: 'ernestina@email.com',
        password: '',
      };
      const exec = jest.fn().mockResolvedValueOnce(mockUser);
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });

      // Act
      const result = await repo.queryById(mockId);

      // Assert
      expect(UserModel.findById).toHaveBeenCalledWith(mockId);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then the search method should be used', async () => {
      // Arrange
      const mockUsers = [{ id: '1', userName: 'Ernestina' }];
      const exec = jest.fn().mockResolvedValueOnce(mockUsers);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      // Act
      const result = await repo.search({ key: 'userName', value: 'Ernestina' });

      // Assert
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    test('Then the create method should be used', async () => {
      const mockUser = {
        userName: 'Ernestina',
        email: 'ernestina@email.com',
        password: '',
      };

      UserModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const result = await repo.create(mockUser);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockUser = { id: '1', userName: 'Ernestina' };
      const updatedUser = { id: '1', userName: 'Pepe' };
      const exec = jest.fn().mockResolvedValueOnce(updatedUser);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
