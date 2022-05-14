import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UUID } from 'angular2-uuid';
import { MatDialogRef } from '@angular/material/dialog';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  isSignedIn = false;

  birthdate: Date = new Date();
  educationForms: Array<string> = ['Liceu', 'Facultate'];
  users: User[] = [];
  user: User = new User();
  loginFormGroup!: FormGroup;
  registerFormGroup!: FormGroup;
  selectedRole: string = '';
  roles: Role[] = [];
  token: any;
  tokenJWT: any;
  formData = new FormData();
  message: string;
  bodyData: any;
  public response: { dbPath: '' };
  @Output() public onUploadFinished = new EventEmitter();
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AuthenticationComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    // this.getUsers();

    this.registerFormGroup = this.fb.group({
      //   fullName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      study: ['', Validators.required],
      image: ['', Validators.required],
      city: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'
          ),
        ],
      ],
    });

    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });

    console.log(this.roles);

    this.userService.getRoles$().subscribe((roles) => {
      this.roles = roles;
    });

    console.log(this.roles);
  }

  hasErrorRegister(controlName: string, errorName: string) {
    return this.registerFormGroup.controls[controlName].hasError(errorName);
  }

  hasErrorLogin(controlName: string, errorName: string) {
    return this.loginFormGroup.controls[controlName].hasError(errorName);
  }

  onSubmitLogin() {
    this.user.email = this.loginFormGroup.value.email;
    this.user.password = this.loginFormGroup.value.password;

    this.userService.login$(this.user.email, this.user.password).subscribe(
      (user: any) => {
        let token = JSON.stringify(user.token);
        this.isSignedIn = true;
        localStorage.setItem('token', token);
        this.userService.setCurrentUser(user);

        this.commonService.showSnackBarMessage(
          'Bun venit' + ' ' + user.firstName,
          'right',
          'top',
          7000
        );
        // this.router.navigate(['/user-management']);
        this.dialogRef.close();
      },
      (error) => console.log('error', error)
    );
  }

  // uploadFile = (files) => {
  //   if (files.length === 0) {
  //     return;
  //   }

  //   let fileToUpload = <File>files[0];

  //   this.formData.append('file', fileToUpload, fileToUpload.name);
  //   this.http
  //     .post('https://localhost:7295/books/saveFile', this.formData, {
  //       reportProgress: true,
  //       observe: 'events',
  //     })
  //     .subscribe({
  //       next: (event) => {
  //         if (event.type === HttpEventType.Response) {
  //           this.commonService.showSnackBarMessage(
  //             'Image upload succes',
  //             'right',
  //             'bottom',
  //             3000
  //           );
  //           this.bodyData = event.body;
  //           console.log(this.bodyData);
  //           console.log(typeof this.bodyData);
  //           this.onUploadFinished.emit(event.body);
  //         }
  //       },
  //       error: (err: HttpErrorResponse) => console.log(err),
  //     });
  // };

  uploadFile(files) {
    if (files.length === 0) {
      return;
    }

    let imageToUpload = <File>files[0];

    this.userService.uploadImage$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          this.commonService.showSnackBarMessage(
            'Image upload succes',
            'right',
            'bottom',
            3000
          );
          this.bodyData = event.body;
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  // test() {
  //   this.user.phoneNumber = this.registerFormGroup.value.phoneNumber;
  //   console.log(this.user.phoneNumber.toString());
  // }
  onSubmitRegister() {
    // this.user.fullName = this.registerFormGroup.value.fullName;
    // this.user.userName = this.registerFormGroup.value.email;
    this.user.firstName = this.registerFormGroup.value.firstName;
    this.user.lastName = this.registerFormGroup.value.lastName;
    this.user.study = this.registerFormGroup.value.study;
    this.user.image = this.bodyData.dbPath;
    this.user.city = this.registerFormGroup.value.city;
    this.user.birthDate = this.registerFormGroup.value.birthDate;
    this.user.phoneNumber = this.registerFormGroup.value.phoneNumber;
    this.user.email = this.registerFormGroup.value.email;
    this.user.password = this.registerFormGroup.value.password;
    this.user.role = 'User';

    this.userService
      .register$(
        //   this.user.fullName,
        this.user.firstName,
        this.user.lastName,
        this.user.study,
        this.user.image,
        this.user.city,
        this.user.birthDate,
        this.user.phoneNumber,
        this.user.email,
        this.user.password,
        this.user.role
      )
      .subscribe(
        (data) => {
          console.log('response', data);
        },
        (error) => console.log('error', error)
      );

    // this.userService.login$(this.user.email, this.user.password).subscribe(
    //   (user: any) => {
    //     let token = JSON.stringify(user.token);
    //     this.isSignedIn = true;
    //     localStorage.setItem('token', token);
    //     this.userService.setCurrentUser(user.data);

    //     // this.router.navigate(['/user-management']);
    //     this.dialogRef.close();
    //   },
    //   (error) => console.log('error', error)
    // );
  }

  selectedRoleHandler(selected: any) {
    this.selectedRole = selected.value;
  }

  change(event) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);
    }
  }

  getUsers() {
    this.userService.getUsers$().subscribe((result) => (this.users = result));
  }

  uuidValue: string = ' ';
  generateUUID() {
    this.uuidValue = UUID.UUID();
    return this.uuidValue;
  }

  handleLogout() {
    this.isSignedIn = false;
  }
}
