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
}
