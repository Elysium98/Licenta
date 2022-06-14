import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryByAdminComponent implements OnInit {
  addCategoryFormGroup: FormGroup;
  editMode: boolean = false;
  matTitle: string = '';
  currentCategory: Category;
  category: Category = new Category();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddCategoryByAdminComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: Category
  ) {
    this.editMode = this.data != null ? true : false;

    if (this.editMode === true) {
      this.addCategoryFormGroup = this.fb.group({
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
      this.addCategoryFormGroup = this.fb.group({
        name: ['', Validators.required],
      });
    } else {
      this.currentCategory = this.data;

      this.addCategoryFormGroup = await this.fb.group({
        name: [this.currentCategory.name],
      });
    }
  }

  hasAddError(controlName: string, errorName: string) {
    return this.addCategoryFormGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    this.category.name = this.addCategoryFormGroup.value.name;

    if (this.editMode === false) {
      this.categoryService.addCategory$(this.category.name).subscribe(
        (data) => {
          this.dialogRef.close('save');
          this.commonService.showSnackBarMessage(
            'Categoria a fost adăugată cu succes !',
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
        name: this.category.name,
      };

      this.categoryService
        .updateCategory$(this.currentCategory.categoryId, model)
        .subscribe(
          (data) => {
            this.commonService.showSnackBarMessage(
              'Categoria a fost editată cu succes !',
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
