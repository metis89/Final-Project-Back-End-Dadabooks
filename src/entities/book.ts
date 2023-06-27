import { Image } from '../types/image';
import { User } from './user';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre:
    | 'Non-Fiction'
    | 'Novel'
    | 'Poetry'
    | 'Horror'
    | 'Fantasy'
    | 'Thrillern';
  synopsis: string;
  image: Image;
  user: User;
};
