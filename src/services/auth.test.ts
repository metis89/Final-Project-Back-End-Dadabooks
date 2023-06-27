import { AuthServices, PayloadToken } from './auth.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcrypt';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Given the AuthServices class', () => {
  describe('When I use createJWT method', () => {
    test('Then the JWT sign method should be called', () => {
      const payload = {} as PayloadToken;
      AuthServices.createJWT(payload);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
  describe('When I use verifyJWTGettingPayload method', () => {
    test('Then the JWT verify method should be called', () => {
      const token = {} as string;
      AuthServices.verifyJWTGettingPayload(token);
      expect(jwt.verify).toHaveBeenCalled();
    });
  });

  describe('When method AuthServices.hash is called', () => {
    test('Then hash should have been called', () => {
      const value = 'Test';
      AuthServices.hash(value);
      expect(bcryptjs.hash).toHaveBeenCalled();
    });
  });

  describe('When method AuthServices.compare is called', () => {
    test('Then compare should have been called', () => {
      const hash = 'Test';
      const value = 'Test';
      AuthServices.compare(value, hash);
      expect(bcryptjs.compare).toHaveBeenCalled();
    });
  });
});
