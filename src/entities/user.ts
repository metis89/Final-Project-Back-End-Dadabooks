import { Book } from './book';

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
  books: Book[];
  rol: string;
};
