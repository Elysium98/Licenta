import { Category } from './category';
import { User } from './user';

export class UpdateBook {
  isbn: string = '';
  // userId: string;
  title: string = '';
  author: string = '';
  publisher: string = '';
  publicationDate: Date = new Date();
  page: number = 0;
  // ISBN: string
  language: string = '';
  condition: string = '';
  isSold: boolean = false;

  constructor(init?: Partial<UpdateBook>) {
    Object.assign(this, init);
  }
}
