import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IUser } from '../models/user';
// import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly baseUrl = 'https://localhost:7295/users';
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  users: IUser[] = [];
  currentUser: IUser = {} as IUser;
  private _currentUserSubject = new BehaviorSubject(this.currentUser);
  currentUser$ = this._currentUserSubject.asObservable();

  private _isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedInSubject.asObservable();

  helper = new JwtHelperService();

  constructor(private httpClient: HttpClient) {}

  register$(
    fullName: string,
    email: string,
    password: string,
    role: string
  ): Observable<IUser> {
    let user = {
      fullName: fullName,
      password: password,
      email: email,
      role: role,
    };
    return this.httpClient.post<IUser>(
      this.baseUrl + '/register',
      user,
      this.httpOptions
    );
  }

  login$(email: string, password: string): Observable<IUser> {
    let user = {
      email: email,
      password: password,
    };
    return this.httpClient.post<IUser>(
      this.baseUrl + '/login',
      user,
      this.httpOptions
    );
  }

  confirmEmail$(model: any) {
    return this.httpClient.post(
      this.baseUrl + '/confirmEmail',
      model,
      this.httpOptions
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUsers$(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(this.baseUrl);
  }

  getRoles$(): Observable<Role[]> {
    return this.httpClient.get<Role[]>('https://localhost:7295/roles');
  }

  // getUserById(id: string): Observable<IUser> {
  //   return this.httpClient.get<IUser>(
  //     this.baseUrl + '/user/' + id,
  //     this.httpOptions
  //   );
  // }
  getUserById$(id: string): Observable<IUser> {
    return this.httpClient.get<IUser>(
      'https://localhost:7295/users/user/' + id
    );
  }

  async getUserByIdAsync(id: string) {
    return await this.httpClient
      .get<IUser>(this.baseUrl + '/user/' + id, this.httpOptions)
      .toPromise();
  }

  // getUsers$() {
  //   return this.httpClient.get<Response>(this.baseUrl).pipe(
  //     map((res: Response) => {
  //       let userList = new Array<IUser>();
  //       if (res.responseCode == ResponseCode.OK) {
  //         if (res.dataSet) {
  //           res.dataSet.map((user: IUser) => {
  //             userList.push(new IUser(user));
  //             console.log(userList);
  //           });
  //         }
  //       }
  //       return userList;
  //     })
  //   );
  // }

  // getRoles$() {
  //   return this.httpClient.get<Response>('https://localhost:7295/roles').pipe(
  //     map((res: Response) => {
  //       let roleList = new Array<Role>();
  //       if (res.responseCode == ResponseCode.OK) {
  //         if (res.dataSet) {
  //           res.dataSet.map((name: Role) => {
  //             roleList.push(new Role(name));
  //             console.log(roleList);
  //           });
  //         }
  //       }
  //       return roleList;
  //     })
  //   );
  // }

  // getRoles$(): Observable<Role[]> {
  //   return this.httpClient.get<Role[]>(
  //     this.baseUrl + '/getRoles',
  //     this.httpOptions
  //   );
  // }

  decodeToken(token: any) {
    return this.helper.decodeToken(token);
  }

  setCurrentUser(user: IUser) {
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

  initializeUser(): Promise<any> {
    return new Promise((resolve) => {
      console.log(this._currentUserSubject.getValue());

      if (localStorage.getItem('token') !== null) {
        var user = this.helper.decodeToken(localStorage.getItem('token'));

        if (this._currentUserSubject.getValue() !== null) {
          this.setCurrentUser(user);
        }
      }

      resolve(null);
    });
  }

  getHttpOptions() {
    const httpOptions2 = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      }),
    };
    return httpOptions2;
  }
}

// addUser(employeeName: string,employeeImage:string, employeeDescription: string, employeeLevelId: string,contactNumber:string,dateCreated:string): Observable<Employee> {
//   let employee = {
//     image:employeeImage,
//     description: employeeDescription,
//     name: employeeName,
//     levelId: employeeLevelId,
//     contactNumber: contactNumber,
//     dateCreated:dateCreated
//   }
//   return this.httpClient.post<Employee>(this.baseUrl + "/Employees", employee, this.httpOptions);
// }

// getUsers$() {
//   let token = JSON.parse(localStorage.getItem('userInfo'));
//   let userInfo = jwt_decode(token);
//   const headers = new HttpHeaders({
//     Authorization: `Bearer ${token}`,
//   });
//   console.log(token);
//   return this.httpClient
//     .get<Response>(this.baseUrl, { headers: headers })
//     .pipe(
//       map((res: any) => {
//         if (res.responseCode == ResponseCode.OK) {
//           if (res.dateSet) {
//             res.dateSet.map((x: IUser) => {
//               this.users.push(x);
//             });
//           }
//         }
//         return this.users;
//       })
//     );
// }

// addUser(object: User): Observable<User> {
//   return this.httpClient.post<User>(this.baseUrl, object, this.httpOptions)
// }
