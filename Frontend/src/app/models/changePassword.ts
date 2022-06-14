export class ChangePassword {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(init?: Partial<ChangePassword>) {
    Object.assign(this, init);
  }
}
