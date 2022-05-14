import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
// import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../models/role';
import { Password } from '../models/password';
import { UpdateUser } from '../models/updateUser';
import { Image } from '../models/image';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  users: User[] = [];
  currentUser: User = {} as User;
  private _currentUserSubject = new BehaviorSubject(this.currentUser);
  currentUser$ = this._currentUserSubject.asObservable();

  private _isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedInSubject.asObservable();

  helper = new JwtHelperService();

  constructor(private httpClient: HttpClient) {}

  deleteUser(id: string) {
    return this.httpClient.delete<User>(
      this.baseUrl + '/' + id,
      this.httpOptions
    );
  }

  register$(
    // fullName: string,
    firstName: string,
    lastName: string,
    study: string,
    image: string,
    city: string,
    birthDate: string,
    phoneNumber: string,
    email: string,
    password: string,
    role: string
  ): Observable<User> {
    let user = {
      // fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      study: study,
      image: image,
      city: city,
      birthDate: birthDate,
      phoneNumber: phoneNumber,
      password: password,
      email: email,
      role: role,
    };
    return this.httpClient.post<User>(
      this.baseUrl + '/register',
      user,
      this.httpOptions
    );
  }

  login$(email: string, password: string): Observable<User> {
    let user = {
      email: email,
      password: password,
    };
    return this.httpClient.post<User>(
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

  getUsers$(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  changePassword$(model: Password): Observable<Password> {
    let password: Password = {
      currentPassword: model.currentPassword,
      newPassword: model.newPassword,
    };
    return this.httpClient.post<Password>(
      this.baseUrl + '/changePassword',
      password,
      this.getHttpOptions()
    );
  }

  updateUserPhoto$(id: string, model: Image): Observable<Image> {
    let img: Image = {
      image: model.image,
    };
    return this.httpClient.put<Image>(
      this.baseUrl + '/user/updatePhoto/' + id,
      img
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
      // image: model.image,
    };
    return this.httpClient.put<UpdateUser>(
      this.baseUrl + '/update/' + id,
      user
    );
  }

  // changeUserDetails$(id: string, email: string): Observable<UpdateUser> {
  //   let user = {
  //     email: email,
  //   };
  //   return this.httpClient.put<UpdateUser>(
  //     this.baseUrl + '/update/' + id,
  //     user
  //   );
  // }
  // changePassword$(
  //   currentPassword: string,
  //   newPassword: string
  // ): Observable<Password> {
  //   let password = {
  //     currentPassword: currentPassword,
  //     newPassword: newPassword,
  //   };

  //   return this.httpClient.post<Password>(
  //     this.baseUrl + '/changePassword',
  //     password,
  //     this.getHttpOptions()
  //   );
  // }
  getRoles$(): Observable<Role[]> {
    return this.httpClient.get<Role[]>('https://localhost:7295/roles');
  }

  // getUserById(id: string): Observable<User> {
  //   return this.httpClient.get<User>(
  //     this.baseUrl + '/user/' + id,
  //     this.httpOptions
  //   );
  // }
  getUserById$(id: string): Observable<User> {
    return this.httpClient.get<User>(
      'https://localhost:7295/users/user/' + id,
      this.httpOptions
    );
  }

  async getUserByIdAsync(id: string) {
    return await this.httpClient
      .get<User>(this.baseUrl + '/user/' + id, this.httpOptions)
      .toPromise();
  }

  getHttpOptions() {
    const httpOptionsJWT = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
      }),
    };

    return httpOptionsJWT;
  }

  // getUsers$() {
  //   return this.httpClient.get<Response>(this.baseUrl).pipe(
  //     map((res: Response) => {
  //       let userList = new Array<User>();
  //       if (res.responseCode == ResponseCode.OK) {
  //         if (res.dataSet) {
  //           res.dataSet.map((user: User) => {
  //             userList.push(new User(user));
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

  initializeUser(): Promise<any> {
    return new Promise(async (resolve) => {
      console.log(this._currentUserSubject.getValue());

      if (localStorage.getItem('token') !== null) {
        var token = this.helper.decodeToken(localStorage.getItem('token'));
        let userId = JSON.stringify(token['nameid']);
        let user: User;
        console.log('idul este' + userId);
        var id: string = '';
        id = JSON.parse(userId);
        console.log(id);
        // this.getUserById$(id).subscribe((data) => (user = data));
        user = await this.getUserByIdAsync(id);
        if (this._currentUserSubject.getValue() !== null) {
          this.setCurrentUser(user);
          console.log('IN SERVICIU ' + user);
        }
      }

      resolve(null);
    });
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
//             res.dateSet.map((x: User) => {
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
