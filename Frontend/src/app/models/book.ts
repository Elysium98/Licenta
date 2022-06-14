import { Category } from './category';
import { User } from './user';

export class Book {
  isbn: string = '';
  id: string = '';
  userId: string = '';
  categoryId: string = '';
  title: string = '';
  author: string = '';
  publisher: string = '';
  publicationDate: Date = new Date();
  page: number = 0;
  price: number = 0;
  language: string = '';
  condition: string = '';
  isSold: boolean = false;
  image: string = '';
  category: Category = new Category();
  user: User = new User();

  constructor(init?: Partial<Book>) {
    Object.assign(this, init);
  }
}
