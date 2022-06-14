import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UpdateUser } from '../models/updateUser';
import { Image } from '../models/image';
import { Login } from '../models/login';
import { ChangePassword } from '../models/changePassword';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [];
  currentUser: User = {} as User;
  private _currentUserSubject = new BehaviorSubject(this.currentUser);
  currentUser$ = this._currentUserSubject.asObservable();

  private _isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedInSubject.asObservable();

  helper = new JwtHelperService();

  readonly baseUrl = 'https://localhost:7295/users';
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

  initializeUser(): Promise<any> {
    return new Promise(async (resolve) => {
      if (localStorage.getItem('token') !== null) {
        let token = this.helper.decodeToken(localStorage.getItem('token'));
        let userId = JSON.stringify(token['nameid']);
        let id = JSON.parse(userId);
        let user = await this.getUserByIdAsync(id);

        if (this._currentUserSubject.getValue() !== null) {
          this.setCurrentUser(user);
        }
      }
      resolve(null);
    });
  }

  register$(model: Partial<User>): Observable<User> {
    let user = new User({
      firstName: model.firstName,
      lastName: model.lastName,
      study: model.study,
      image: model.image,
      city: model.city,
      birthDate: model.birthDate,
      phoneNumber: model.phoneNumber,
      password: model.password,
      email: model.email,
      role: model.role,
    });
    return this.httpClient.post<User>(
      this.baseUrl + '/register',
      user,
      this.httpOptions
    );
  }

  login$(model: Login): Observable<Login> {
    let user: Login = {
      email: model.email,
      password: model.password,
    };
    return this.httpClient.post<Login>(
      this.baseUrl + '/login',
      user,
      this.httpOptions
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUsers$(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  changePassword$(
    model: ChangePassword,
    id: string
  ): Observable<ChangePassword> {
    let password: ChangePassword = {
      currentPassword: model.currentPassword,
      newPassword: model.newPassword,
    };
    return this.httpClient.put<ChangePassword>(
      this.baseUrl + '/changePassword/' + id,
      password,
      this.getHttpOptionsBearer()
    );
  }

  updateUserPhoto$(id: string, model: Image): Observable<Image> {
    let img: Image = {
      image: model.image,
    };
    return this.httpClient.put<Image>(
      this.baseUrl + '/user/updatePhoto/' + id,
      img,
      this.getHttpOptionsBearer()
    );
  }

  uploadImage$(image: File): Observable<HttpEvent<Response>> {
    const formData = new FormData();

    formData.append('image', image, image.name);

    return this.httpClient.post<Response>(
      this.baseUrl + '/savePhoto',
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  changeUserDetails$(id: string, model: UpdateUser): Observable<UpdateUser> {
    let user: UpdateUser = {
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      study: model.study,
      phoneNumber: model.phoneNumber,
    };
    return this.httpClient.put<UpdateUser>(
      this.baseUrl + '/update/' + id,
      user,
      this.getHttpOptionsBearer()
    );
  }

  getUserById$(id: string): Observable<User> {
    return this.httpClient.get<User>(
      this.baseUrl + '/user/' + id,
      this.httpOptions
    );
  }

  async getUserByIdAsync(id: string) {
    return await this.httpClient
      .get<User>(this.baseUrl + '/user/' + id, this.httpOptions)
      .toPromise();
  }

  decodeToken(token: any) {
    return this.helper.decodeToken(token);
  }

  setCurrentUser(user: User) {
    return this._currentUserSubject.next(user);
  }

  checkUserLogin(): Observable<boolean> {
    if (localStorage.getItem('token') !== null) {
      this._isLoggedInSubject.next(true);
      return of(true);
    } else {
      this._isLoggedInSubject.next(false);
      return of(false);
    }
  }

  deleteUser(id: string) {
    return this.httpClient.delete<User>(
      this.baseUrl + '/' + id,
      this.getHttpOptionsBearerTextResponse()
    );
  }
}
