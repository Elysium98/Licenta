import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Image } from 'src/app/models/image';
import { Password } from 'src/app/models/password';
import { UpdateUser } from 'src/app/models/updateUser';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  updateUserFormGroup!: FormGroup;
  securityFormGroup!: FormGroup;
  educationForms: Array<string> = ['Liceu', 'Facultate'];
  // @Output() public onUploadFinished = new EventEmitter();

  image: string = '';
  private _imageSubject = new BehaviorSubject(this.image);
  image$ = this._imageSubject.asObservable();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private commonService: CommonService
  ) {
    this.userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    )['nameid'];
  }
  currentUser$: Observable<User> = this.userService.currentUser$;
  //user: User;
  user: User = new User();
  userEmail: UpdateUser = new UpdateUser();
  userLogged: string;
  password: Password = new Password();
  formData = new FormData();
  // user22: User = new User();
  // image22;

  bodyData: any;
  imgUrl: string = '';
  public response: { dbPath: '' };
  async ngOnInit() {
    // this.currentUser$.subscribe((data) => (this.user = data));
    // console.log(this.user);
    //this.getUser(this.userLogged);
    this.userService.getUserByIdAsync(this.userLogged);
    this.user = await this.userService.getUserByIdAsync(this.userLogged);
    this.imgUrl = await this.createImgPath2();
    // this.createImgPath2();
    console.log(this.user);
    this._imageSubject.next(this.imgUrl);

    // console.log(this.userLogged);
    // console.log(typeof this.userLogged);

    // this.userService
    //   .getUserById$(this.userLogged)
    //   .subscribe((data) => (this.user22 = data));

    this.updateUserFormGroup = this.fb.group({
      email: [this.user.email, Validators.email],
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      phoneNumber: [this.user.phoneNumber],
      study: [this.user.study],
      image: '',
    });

    this.securityFormGroup = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'
          ),
        ],
      ],
      confirmNewPassword: ['', Validators.required],
    });
  }

  async getUser(id: string) {
    this.user = await this.userService.getUserByIdAsync(id);
    console.log(this.user.email);
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };
  get newPassword(): AbstractControl {
    return this.securityFormGroup.controls['newPassword'];
  }

  get confirmNewPassword(): AbstractControl {
    return this.securityFormGroup.controls['confirmNewPassword'];
  }

  async createImgPath2() {
    return await `https://localhost:7295/${this.user.image}`;
  }

  onPasswordChange() {
    if (this.confirmNewPassword.value == this.newPassword.value) {
      this.confirmNewPassword.setErrors(null);
    } else {
      this.confirmNewPassword.setErrors({ mismatch: true });
      this.securityFormGroup.invalid;
    }
  }

  uploadFile(files) {
    if (files.length === 0) {
      return;
    }

    let imageToUpload = <File>files[0];

    this.userService.uploadImage$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          this.bodyData = event.body;
          this.updateUser();
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  updateUser() {
    this.user.image = this.bodyData.dbPath;

    let model: Image = {
      image: this.user.image,
    };
    this.userService.updateUserPhoto$(this.user.id, model).subscribe(
      async (data) => {
        this.imgUrl = await this.createImgPath2();
        this._imageSubject.next(this.imgUrl);
        // this.userService.getUsers$();
        this.commonService.showSnackBarMessage(
          'Poză actualizată cu succes !',
          'right',
          'bottom',
          4000,
          'notif-success'
        );
      },
      (error) => console.log('error', error)
    );
  }

  onSubmitDetails() {
    this.user.email = this.updateUserFormGroup.value.email;
    this.user.firstName = this.updateUserFormGroup.value.firstName;
    this.user.lastName = this.updateUserFormGroup.value.lastName;
    this.user.phoneNumber = this.updateUserFormGroup.value.phoneNumber;
    this.user.study = this.updateUserFormGroup.value.study;

    let model: UpdateUser = {
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      study: this.user.study,
      phoneNumber: this.user.phoneNumber,
    };

    this.userService.changeUserDetails$(this.user.id, model).subscribe(
      (data) => {
        this.commonService.showSnackBarMessage(
          'Informații actualizate cu succes !',
          'right',
          'bottom',
          4000,
          'notif-success'
        );
      },
      (error) => console.log('error', error)
    );
  }

  onSubmit() {
    this.password.newPassword = this.securityFormGroup.value.newPassword;

    this.password.currentPassword =
      this.securityFormGroup.value.currentPassword;

    let model: Password = {
      currentPassword: this.password.currentPassword,
      newPassword: this.password.newPassword,
    };

    this.userService.changePassword$(model).subscribe(
      (data) => {
        console.log('response', data);
        this.userService.logout();
        this.router.navigate(['/home']);
        this.commonService.showSnackBarMessage(
          'Parolă schimbată cu succes !',
          'right',
          'bottom',
          3000,
          'notif-success'
        );
      },
      (error) => console.log('error', error)
    );
  }

  hasErrorSecurity(controlName: string, errorName: string) {
    return this.securityFormGroup.controls[controlName].hasError(errorName);
  }
  hasErrorDetails(controlName: string, errorName: string) {
    return this.updateUserFormGroup.controls[controlName].hasError(errorName);
  }

  change(event) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);
    }
  }
}
