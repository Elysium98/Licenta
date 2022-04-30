import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  updateUserFormGroup!: FormGroup;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    )['nameid'];
  }
  currentUser$: Observable<IUser> = this.userService.currentUser$;
  user: IUser;
  user22: IUser;
  userLogged: string;

  ngOnInit() {
    this.currentUser$.subscribe((data) => (this.user = data));
    console.log(this.user);

    console.log(this.userLogged);
    console.log(typeof this.userLogged);

    console.log(this.user22);
    this.userService
      .getUserById$(this.userLogged)
      .subscribe((data) => (this.user22 = data));

    this.userService
      .getUserById$(this.userLogged)
      .pipe(tap((data) => console.log(data)));

    this.getUser(this.userLogged);

    //   this.updateUserFormGroup = this.fb.group({
    //     email: [''],
    //     password: [
    //       '',
    //       Validators.pattern(
    //         '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'
    //       ),
    //     ],
    //   });
  }

  async getUser(id: string) {
    this.user22 = await this.userService.getUserByIdAsync(id);
    console.log(this.user22);
  }
}
