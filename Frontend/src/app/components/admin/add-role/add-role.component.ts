import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/models/role';
import { RoleService } from 'src/app/services/role.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleByAdminComponent implements OnInit {
  addRoleFormGroup: FormGroup;
  editMode: boolean = false;
  matTitle: string = '';
  currentRole: Role;
  role: Role = new Role();
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private dialogRef: MatDialogRef<AddRoleByAdminComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: Role
  ) {
    this.editMode = this.data != null ? true : false;

    if (this.editMode === true) {
      this.addRoleFormGroup = this.fb.group({
        name: [''],
      });
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.editMode === false) {
      this.matTitle = 'Adăugați un rol';
    } else {
      this.matTitle = 'Editați rolul';
    }

    if (this.editMode === false) {
      this.addRoleFormGroup = this.fb.group({
        name: ['', Validators.required],
      });
    } else {
      this.currentRole = this.data;

      this.addRoleFormGroup = await this.fb.group({
        name: [this.currentRole.name],
      });
    }
  }

  hasAddError(controlName: string, errorName: string) {
    return this.addRoleFormGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    this.role.name = this.addRoleFormGroup.value.name;

    if (this.editMode === false) {
      this.roleService.addRole$(this.role.name).subscribe(
        (data) => {
          this.dialogRef.close('save');
          this.commonService.showSnackBarMessage(
            'Rol adăugat cu succes',
            'center',
            'bottom',
            4000,
            'notif-success'
          );
        },
        (error) => console.log('error', error)
      );
    } else {
      let model = {
        name: this.role.name,
      };

      this.roleService.updateRole$(this.currentRole.id, model).subscribe(
        (data) => {
          this.commonService.showSnackBarMessage(
            'Rol editat cu succes',
            'center',
            'bottom',
            4000,
            'notif-success'
          );

          this.dialogRef.close('save');
        },
        (error) => console.log('error', error)
      );
    }
  }
}
