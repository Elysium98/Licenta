import { Role } from './role';

export class User {
  id: string = '';
  //fullName: string = '';

  firstName: string = '';
  lastName: string = '';
  study: string = '';
  image: string = '';
  city: string = '';
  birthDate: string = '';
  phoneNumber: string = '';
  email: string = '';
  password: string = '';
  userName: string = '';
  role: string = '';

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
  // constructor(fullName: string, email: string, userName: string) {
  //   this.fullName = fullName;
  //   this.email = email;
  //   this.userName = userName;
  // }
}
