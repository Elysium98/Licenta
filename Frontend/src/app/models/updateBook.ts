import { Category } from './category';
import { User } from './user';

export class UpdateBook {
  // userId: string;
  title: string = '';
  author: string = '';
  publishing: string = '';
  // publicationDate: Date;
  page: number = 0;
  // ISBN: string
  language: string = '';
  status: string = '';

  constructor(init?: Partial<UpdateBook>) {
    Object.assign(this, init);
  }
}
