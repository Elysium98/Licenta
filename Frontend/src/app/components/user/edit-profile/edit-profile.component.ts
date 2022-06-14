import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ChangePassword } from 'src/app/models/changePassword';
import { Image } from 'src/app/models/image';
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
  image: string = '';
  private _imageSubject = new BehaviorSubject(this.image);
  image$ = this._imageSubject.asObservable();
  user: User = new User();
  userEmail: UpdateUser = new UpdateUser();
  userLogged: string;
  password: ChangePassword = new ChangePassword();
  formData = new FormData();
  image2: string = ' ../../../assets/img/edit_user_img.png';
  image2$: Promise<any>;
  bodyData: any;
  imgUrl: string = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService
  ) {
    this.image2$ = this.commonService.loadImage(this.image2);

    this.userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    )['nameid'];
  }

  async ngOnInit() {
    this.userService.getUserByIdAsync(this.userLogged);
    this.user = await this.userService.getUserByIdAsync(this.userLogged);
    this.imgUrl = await this.createImgPath();

    this._imageSubject.next(this.imgUrl);

    this.updateUserFormGroup = this.fb.group({
      email: [this.user.email, Validators.email],
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      phoneNumber: [this.user.phoneNumber, Validators.pattern('[0-9]{10}')],
      study: [this.user.study],
      city: [this.user.city],
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

  get newPassword(): AbstractControl {
    return this.securityFormGroup.controls['newPassword'];
  }

  get confirmNewPassword(): AbstractControl {
    return this.securityFormGroup.controls['confirmNewPassword'];
  }

  async createImgPath() {
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
        this.imgUrl = await this.createImgPath();
        this._imageSubject.next(this.imgUrl);
        this.commonService.showSnackBarMessage(
          'Poza a fost actualizată cu succes !',
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
          'Informațiile au fost actualizate cu succes !',
          'right',
          'bottom',
          4000,
          'notif-success'
        );
      },
      (error) => console.log(error)
    );
  }

  onSubmit() {
    this.password.newPassword = this.securityFormGroup.value.newPassword;
    this.password.currentPassword =
      this.securityFormGroup.value.currentPassword;

    let model: ChangePassword = {
      currentPassword: this.password.currentPassword,
      newPassword: this.password.newPassword,
    };

    this.userService.changePassword$(model, this.user.id).subscribe(
      (data) => {
        this.userService.logout();
        this.router.navigate(['/home']);
        this.commonService.showSnackBarMessage(
          'Parola a fost schimbată cu succes ! Vă rugăm să vă logați !',
          'right',
          'bottom',
          3000,
          'notif-success'
        );
      },
      (error) => {
        if ((error.error = 'Invalid Password')) {
          this.commonService.showSnackBarMessage(
            'Parola curentă nu este corectă !',
            'right',
            'bottom',
            3000,
            'notif-error'
          );
        }
      }
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
    }
  }
}
