export class Image {
  image: string = '';

  constructor(init?: Partial<Image>) {
    Object.assign(this, init);
  }
}
