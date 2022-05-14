import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  private _searchPropertySubject = new BehaviorSubject<string>('');
  searchProperty$ = this._searchPropertySubject.asObservable();
  //searchProperty$ = this._searchPropertySubject.toPromise();
  private _searchValueSubject = new BehaviorSubject<string>('');
  searchValue$ = this._searchValueSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  setCurrentProperty(property: string) {
    return this._searchPropertySubject.next(property);
  }

  setCurrentValue(value: string) {
    return this._searchValueSubject.next(value);
  }

  async asyncExample() {
    const result = await this.searchProperty$;

    return result;
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
    uid: string,
    userId: string,
    title: string,
    author: string,
    publishing: string,
    page: number,
    language: string,
    status: string,
    categoryId: string,
    image: string
  ): Observable<Book> {
    let book = {
      id: uid,
      userId: userId,
      title: title,
      author: author,
      publishing: publishing,
      page: page,
      language: language,
      status: status,
      categoryId: categoryId,
      image: image,
    };
    return this.httpClient.post<Book>(this.baseUrl, book, this.httpOptions);
  }

  // updateBook$(book: Book): Observable<Book> {
  //   console.log(book);
  //   return this.httpClient.put<Book>(this.baseUrl, book, this.httpOptions);
  // }

  updateBook$(id: string, model): Observable<UpdateBook> {
    let book: UpdateBook = {
      title: model.title,
      author: model.author,
      publishing: model.publishing,
      page: model.page,
      language: model.language,
      status: model.status,
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
