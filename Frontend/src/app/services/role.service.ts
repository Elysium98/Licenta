import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  readonly baseUrl = 'https://localhost:7295/roles';
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

  getRoles$(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.baseUrl, this.httpOptions);
  }

  addRole$(name: string): Observable<Role> {
    let role = {
      name: name,
    };
    return this.httpClient.post<Role>(this.baseUrl, role);
  }

  updateRole$(id: string, model): Observable<Role> {
    let role = {
      name: model.name,
    };
    return this.httpClient.put<Role>(
      this.baseUrl + '/' + id,
      role,
      this.getHttpOptionsBearer()
    );
  }

  deleteRole(id: string) {
    return this.httpClient.delete<Role>(
      this.baseUrl + '/' + id,
      this.getHttpOptionsBearerTextResponse()
    );
  }
}
