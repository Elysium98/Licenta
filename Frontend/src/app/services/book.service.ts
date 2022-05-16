import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Book } from '../models/book';
import { UpdateBook } from '../models/updateBook';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  readonly baseUrl = 'https://localhost:7295/books';
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  readonly httpOptionsText = {
    headers: new HttpHeaders({
      Accept: 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'text/plain, charset=utf-8',
    }),
    observe: 'response',
    responseType: 'text',
  };

  public _searchPropertySubject = new BehaviorSubject<string>('');
  searchProperty$ = this._searchPropertySubject.asObservable();
  //searchProperty$ = this._searchPropertySubject.toPromise();
  private _searchValueSubject = new BehaviorSubject<string>('');
  searchValue$ = this._searchValueSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  setCurrentProperty(property: string) {
    this._searchPropertySubject.next(property);

    // let test34;
    // console.log(
    //   'In serviciu subject-ul e  ' + this._searchPropertySubject.getValue()
    // );
    // this.searchProperty$.subscribe((data) => (test34 = data));
    // console.log('searchProperty$ este  ' + test34);
  }

  async getProfileObs() {
    return await this._searchPropertySubject.getValue();
  }

  setCurrentValue(value: string) {
    return this._searchValueSubject.next(value);
  }

  async asyncExample() {
    return await this._searchPropertySubject;
  }

  getBooks$(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.baseUrl, this.httpOptions);
  }

  deleteBook(id: string) {
    return this.httpClient.delete<Book>('https://localhost:7295/books/' + id, {
      responseType: 'text' as 'json',
    });
  }

  async getBooksAsync$() {
    return await this.httpClient
      .get<Book[]>(this.baseUrl, this.httpOptions)
      .toPromise();
  }

  async getBooksByUserAndStatusAsync$(userId: string, isSold: boolean) {
    return await this.httpClient
      .get<Book[]>(this.baseUrl + '/' + userId + '/' + isSold, this.httpOptions)
      .toPromise();
  }

  async getBooksByStatusAsync$(isSold: boolean) {
    return await this.httpClient
      .get<Book[]>(this.baseUrl + '/status/' + isSold, this.httpOptions)
      .toPromise();
  }

  async getBooksByCategoryAsync$(categoryName: string) {
    return await this.httpClient
      .get<Book[]>(this.baseUrl + '/category/' + categoryName, this.httpOptions)
      .toPromise();
  }

  getSearchedBooks$(title: string): Observable<Book[]> {
    return this.httpClient
      .get<Book[]>(this.baseUrl, this.httpOptions)
      .pipe(map((books) => books.filter((book) => book.title.includes(title))));
  }

  getBookById$(id: string): Observable<Book> {
    return this.httpClient.get<Book>(this.baseUrl + '/' + id, this.httpOptions);
  }

  async getBookByIdAsync$(id: string) {
    return await this.httpClient
      .get<Book>(this.baseUrl + '/' + id, this.httpOptions)
      .toPromise();
  }

  addBook$(
    isbn: string,
    // uid: string,
    userId: string,
    title: string,
    author: string,
    publisher: string,
    publicationDate: Date,
    page: number,
    language: string,
    condition: string,
    categoryId: string,
    image: string,
    isSold: boolean
  ): Observable<Book> {
    let book = {
      isbn: isbn,
      // id: uid,
      userId: userId,
      title: title,
      author: author,
      publisher: publisher,
      publicationDate: publicationDate,
      page: page,
      language: language,
      condition: condition,
      categoryId: categoryId,
      image: image,
      isSold: isSold,
    };
    return this.httpClient.post<Book>(this.baseUrl, book, this.httpOptions);
  }

  // updateBook$(book: Book): Observable<Book> {
  //   console.log(book);
  //   return this.httpClient.put<Book>(this.baseUrl, book, this.httpOptions);
  // }

  updateBook$(id: string, model): Observable<UpdateBook> {
    let book: UpdateBook = {
      isbn: model.isbn,
      title: model.title,
      author: model.author,
      publisher: model.publisher,
      publicationDate: model.publicationDate,
      page: model.page,
      language: model.language,
      condition: model.condition,
      isSold: model.isSold,
    };
    return this.httpClient.put<UpdateBook>(this.baseUrl + '/' + id, book);
  }

  saveImageBook$(image: File): Observable<HttpEvent<Response>> {
    const formData = new FormData();

    formData.append('image', image, image.name);

    return this.httpClient.post<Response>(
      this.baseUrl + '/saveFile',
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  updatePhotoBook$(id: string, model: Image): Observable<Image> {
    let img: Image = {
      image: model.image,
    };
    return this.httpClient.put<Image>(
      this.baseUrl + '/book/updatePhoto/' + id,
      img
    );
  }
}
