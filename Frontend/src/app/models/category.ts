export class Category {
  categoryId: string = '';
  name: string = '';

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}
