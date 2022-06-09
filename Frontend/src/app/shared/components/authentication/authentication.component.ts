import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UUID } from 'angular2-uuid';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  selectedTab: any;
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
    private commonService: CommonService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.registerFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      study: ['', Validators.required],
      image: ['', Validators.required],
      city: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  hasRegisterError(controlName: string, errorName: string) {
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
          7000,
          'notif-success'
        );

        this.dialogRef.close();
      },
      (error) => {
        console.log('error', error);
        if ((error.error = 'Invalid email or password')) {
          this.commonService.showSnackBarMessage(
            'Email sau parola greșită',
            'right',
            'bottom',
            3000,
            'notif-error'
          );
        }
      }
    );
  }

  uploadFile(files) {
    if (files.length === 0) {
      return;
    }

    let imageToUpload = <File>files[0];

    this.userService.uploadImage$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          this.commonService.showSnackBarMessage(
            'Imagine încărcată cu succes',
            'right',
            'bottom',
            3000,
            'notif-success'
          );
          this.bodyData = event.body;
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  onSubmitRegister() {
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
          // this.dialogRef.close();
          // this.dialog.open(AuthenticationComponent, {
          //   width: '530px',
          //   height: '850px',
          // });
          this.selectedTab = 0;
          this.commonService.showSnackBarMessage(
            'Înregistrare cu succes',
            'right',
            'bottom',
            4000,
            'notif-success'
          );
        },
        (error) => {
          console.log('error', error);
          if ((error.errors = 'DuplicateEmail')) {
            this.commonService.showSnackBarMessage(
              'Emailul există deja',
              'right',
              'bottom',
              3000,
              'notif-error'
            );
          }
        }
      );
  }

  selectedRoleHandler(selected: any) {
    this.selectedRole = selected.value;
  }

  change(event) {
    console.log(event);
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
