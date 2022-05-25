export class Role {
  id: string = '';
  name: string = '';

  // constructor(name: string) {
  //   this.name = name;
  // }
  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}
