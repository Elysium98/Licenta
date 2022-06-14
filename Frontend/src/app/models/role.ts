export class Role {
  id: string = '';
  name: string = '';

  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}
