export class Password {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(init?: Partial<Password>) {
    Object.assign(this, init);
  }
}
