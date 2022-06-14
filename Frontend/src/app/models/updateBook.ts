export class UpdateBook {
  isbn: string = '';
  title: string = '';
  author: string = '';
  publisher: string = '';
  publicationDate: Date = new Date();
  page: number = 0;
  language: string = '';
  condition: string = '';
  isSold: boolean = false;

  constructor(init?: Partial<UpdateBook>) {
    Object.assign(this, init);
  }
}
