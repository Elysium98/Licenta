export class UpdateUser {
  email: string = '';
  lastName: string = '';
  firstName: string = '';
  study: string = '';
  phoneNumber: string = '';
  // image: string = '';
  constructor(init?: Partial<UpdateUser>) {
    Object.assign(this, init);
  }
}
