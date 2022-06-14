import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserByAdminComponent implements OnInit {
  addUserFormGroup: FormGroup;
  editMode: boolean = false;
  matTitle: string = '';
  currentUser: User;
  user: User = new User();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddUserByAdminComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: User
  ) {
    this.editMode = this.data != null ? true : false;

    if (this.editMode === true) {
      this.addUserFormGroup = this.fb.group({
        name: [''],
      });
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.editMode === false) {
      this.matTitle = 'Adăugați o categorie';
    } else {
      this.matTitle = 'Editați o categorie';
    }

    if (this.editMode === false) {
      this.addUserFormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        study: ['', Validators.required],
        city: ['', Validators.required],
        birthDate: ['', Validators.required],
        phoneNumber: ['', Validators.pattern('[0-9]{10}')],
        email: ['', Validators.email],
        role: ['', Validators.required],
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
    } else {
      this.currentUser = this.data;

      this.addUserFormGroup = await this.fb.group({
        firstName: [this.currentUser.firstName],
        lastName: [this.currentUser.lastName],
        study: [this.currentUser.study],
        city: [this.currentUser.city],
        birthDate: [this.currentUser.birthDate],
        phoneNumber: [
          this.currentUser.phoneNumber,
          Validators.pattern('[0-9]{10}'),
        ],
        email: [this.currentUser.email, Validators.email],
        role: [this.currentUser.role],
      });
    }
  }

  hasAddError(controlName: string, errorName: string) {
    return this.addUserFormGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    // this.user.name = this.addUserFormGroup.value.name;
    // if (this.editMode === false) {
    //   this.user.addCategory$(this.category.name).subscribe(
    //     (data) => {
    //       this.dialogRef.close('save');
    //       this.commonService.showSnackBarMessage(
    //         'Categoria a fost adăugată cu succes !',
    //         'center',
    //         'bottom',
    //         4000,
    //         'notif-success'
    //       );
    //     },
    //     (error) => console.log('error', error)
    //   );
    // } else {
    //   let model = {
    //     name: this.category.name,
    //   };
    //   this.categoryService
    //     .updateCategory$(this.currentCategory.categoryId, model)
    //     .subscribe(
    //       (data) => {
    //         this.commonService.showSnackBarMessage(
    //           'Categoria a fost editată cu succes !',
    //           'center',
    //           'bottom',
    //           4000,
    //           'notif-success'
    //         );
    //         this.dialogRef.close('save');
    //       },
    //       (error) => console.log('error', error)
    //     );
    // }
  }
}
