import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../models/book';

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

  constructor(private httpClient: HttpClient) {}

  getBooks$(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.baseUrl, this.httpOptions);
  }

  getSearchedBooks$(title: string): Observable<Book[]> {
    return this.httpClient
      .get<Book[]>(this.baseUrl, this.httpOptions)
      .pipe(map((books) => books.filter((book) => book.title.includes(title))));
  }

  getBookById$(id: string): Observable<Book> {
    return this.httpClient.get<Book>(this.baseUrl + id, this.httpOptions);
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

  updateBook$(book: Book): Observable<Book> {
    console.log(book);
    return this.httpClient.put<Book>(this.baseUrl, book, this.httpOptions);
  }
}
