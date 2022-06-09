export class Email {
  emailTo: string = '';
  subject: string = '';
  body: string = '';

  constructor(init?: Partial<Email>) {
    Object.assign(this, init);
  }
}
