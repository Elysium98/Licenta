export class User {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  study: string = '';
  image: string = '';
  city: string = '';
  birthDate: Date = new Date();
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
