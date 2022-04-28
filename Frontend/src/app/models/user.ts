import { Role } from './role';

export class IUser {
  id: string = '';
  fullName: string = '';
  email: string = '';
  password: string = '';
  userName: string = '';
  role: string = '';

  constructor(init?: Partial<IUser>) {
    Object.assign(this, init);
  }
  // constructor(fullName: string, email: string, userName: string) {
  //   this.fullName = fullName;
  //   this.email = email;
  //   this.userName = userName;
  // }
}
