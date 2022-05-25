import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  readonly baseUrl = 'https://localhost:7295/categories';
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getHttpOptionsBearer() {
    const httpOptionsJWT = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      }),
    };

    return httpOptionsJWT;
  }

  getHttpOptionsBearerTextResponse() {
    const httpOptionsJWT = {
      responseType: 'text' as 'json',
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      }),
    };
    return httpOptionsJWT;
  }
  constructor(private httpClient: HttpClient) {}

  getCategories$(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseUrl, this.httpOptions);
  }

  async getCategoryByName$(name: string) {
    return await this.httpClient
      .get<Category>(this.baseUrl + name, this.httpOptions)
      .toPromise();
  }

  async getCategoryByIdAsync$(id: string) {
    return await this.httpClient
      .get<Category>(this.baseUrl + '/' + id, this.httpOptions)
      .toPromise();
  }

  addCategory$(name: string): Observable<Category> {
    let category = {
      name: name,
    };
    return this.httpClient.post<Category>(
      this.baseUrl,
      category,
      this.getHttpOptionsBearer()
    );
  }

  updateCategory$(id: string, model): Observable<Category> {
    let category = {
      name: model.name,
    };
    return this.httpClient.put<Category>(
      this.baseUrl + '/' + id,
      category,
      this.getHttpOptionsBearer()
    );
  }

  deleteCategory(id: string) {
    return this.httpClient.delete<Category>(
      this.baseUrl + '/' + id,
      this.getHttpOptionsBearerTextResponse()
    );
  }
}
