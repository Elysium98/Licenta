export class Login {
  email: string = '';
  password: string = '';

  constructor(init?: Partial<Login>) {
    Object.assign(this, init);
  }
}
