import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UUID } from 'angular2-uuid';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { CommonService } from '../../common.service';
import { Login } from 'src/app/models/login';

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
  bodyData: any;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AuthenticationComponent>,
    private fb: FormBuilder,
    private commonService: CommonService
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

    let model: Login = {
      email: this.user.email,
      password: this.user.password,
    };

    this.userService.login$(model).subscribe(
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
            'Email-ul sau parola greșită',
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
            'Imaginea a fost încărcată cu succes',
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

    let model: Partial<User> = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      study: this.user.study,
      image: this.user.image,
      city: this.user.city,
      birthDate: this.user.birthDate,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
    };

    this.userService.register$(model).subscribe(
      (data) => {
        this.selectedTab = 0;
        this.commonService.showSnackBarMessage(
          'Înregistrare cu succes !',
          'right',
          'bottom',
          4000,
          'notif-success'
        );
      },
      (error) => {
        if ((error.errors = 'DuplicateEmail')) {
          this.commonService.showSnackBarMessage(
            'Email-ul există deja',
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
