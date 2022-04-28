import { Category } from './category';

export class Book {
  id: string = '';
  userId: string = '';
  // userId: string;
  title: string = '';
  author: string = '';
  publishing: string = '';
  // publicationDate: Date;
  page: number = 0;
  // ISBN: string
  language: string = '';
  status: string = '';
  image: string = '';
  category: Category = new Category();
  // category: string = '';
  constructor(init?: Partial<Book>) {
    Object.assign(this, init);
  }
}
