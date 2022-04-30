import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { IUser } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UUID } from 'angular2-uuid';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  isSignedIn = false;

  birthdate: Date = new Date();

  users: IUser[] = [];
  user: IUser = new IUser();
  loginFormGroup!: FormGroup;
  registerFormGroup!: FormGroup;
  selectedRole: string = '';
  roles: Role[] = [];
  token: any;
  tokenJWT: any;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AuthenticationComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.getUsers();

    this.registerFormGroup = this.fb.group({
      fullName: ['', Validators.required],
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

        // this.router.navigate(['/user-management']);
        this.dialogRef.close();
      },
      (error) => console.log('error', error)
    );
  }

  onSubmitRegister() {
    this.user.fullName = this.registerFormGroup.value.fullName;
    this.user.email = this.registerFormGroup.value.email;
    this.user.password = this.registerFormGroup.value.password;
    this.user.role = 'User';

    this.userService
      .register$(
        this.user.fullName,
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
