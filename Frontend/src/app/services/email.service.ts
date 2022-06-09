import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Email } from '../models/email';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  readonly baseUrl = 'https://localhost:7295/email';
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

  sendEmail$(model): Observable<Email> {
    let email: Email = {
      emailTo: model.emailTo,
      subject: model.subject,
      body: model.body,
    };
    return this.httpClient.post<Email>(
      ' https://localhost:7295/email/sendMessage',
      email,
      this.httpOptions
    );
  }
}
