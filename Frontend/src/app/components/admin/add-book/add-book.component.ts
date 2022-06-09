import { Component, Inject, OnInit, Optional } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookByAdminComponent implements OnInit {
  addBookFormGroup: FormGroup;
  editMode: boolean = false;
  matTitle: string = '';
  categories: Category[] = [];
  users: User[] = [];
  currentCategory: Category;
  conditions: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  states: Array<string> = ['Activa', 'Vanduta'];
  state: any;
  selectedCategory: Category;
  public response: { dbPath: '' };

  formData = new FormData();
  convertedDate: any;
  bodyData: any;
  currentBook: Book;
  book: Book = new Book();

  addBookPhoto(files) {
    if (files.length === 0) {
      return;
    }

    let imageToUpload = <File>files[0];

    this.bookService.saveImageBook$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          this.bodyData = event.body;
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private userService: UserService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<AddBookByAdminComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: Book
  ) {
    this.editMode = this.data != null ? true : false;

    if (this.editMode === true) {
      this.addBookFormGroup = this.fb.group({
        isbn: [''],
        title: [''],
        author: ['', Validators.maxLength(100)],
        publisher: [''],
        publicationDate: [''],
        category: [''],
        page: [''],
        price: [''],
        language: [''],
        condition: [''],
        image: [''],
        state: [''],
      });
      this.categoryService.getCategories$().subscribe((categories) => {
        this.categories = categories;
      });
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.editMode === false) {
      this.matTitle = 'Adăugați o carte';
    } else {
      this.matTitle = 'Editați o carte';
    }

    if (this.editMode === false) {
      this.addBookFormGroup = this.fb.group({
        isbn: ['', Validators.required],
        title: ['', Validators.required],
        author: ['', [Validators.required, Validators.maxLength(30)]],
        publisher: ['', Validators.required],
        publicationDate: ['', Validators.required],
        category: ['', Validators.required],
        page: ['', Validators.required],
        price: ['', Validators.required],
        language: ['', Validators.required],
        condition: ['', Validators.required],
        image: ['', Validators.required],
      });

      this.categoryService.getCategories$().subscribe((categories) => {
        this.categories = categories;
      });
    } else {
      this.currentBook = this.data;

      this.convertedDate = this.datePipe.transform(
        this.currentBook.publicationDate,
        'yyyy-MM-dd'
      );

      this.currentCategory = this.currentBook.category;

      if (this.currentBook.isSold === false) {
        this.state = 'Activa';
      } else {
        this.state = 'Vanduta';
      }
      this.addBookFormGroup = await this.fb.group({
        isbn: [this.currentBook.isbn],
        title: [this.currentBook.title],
        author: [this.currentBook.author, Validators.maxLength(100)],
        publisher: [this.currentBook.publisher],
        publicationDate: [this.convertedDate],
        category: [this.currentCategory.name],
        page: [this.currentBook.page],
        price: [this.currentBook.price],
        language: [this.currentBook.language],
        condition: [this.currentBook.condition],
        state: [this.state],
      });
    }
  }

  hasAddError(controlName: string, errorName: string) {
    return this.addBookFormGroup.controls[controlName].hasError(errorName);
  }

  async onSubmit() {
    if (this.editMode === false) {
      this.book.isbn = this.addBookFormGroup.value.isbn;
      this.book.title = this.addBookFormGroup.value.title;
      this.book.author = this.addBookFormGroup.value.author;
      this.book.publisher = this.addBookFormGroup.value.publisher;
      this.book.publicationDate = this.addBookFormGroup.value.publicationDate;
      this.book.category = this.addBookFormGroup.value.category;
      this.book.page = this.addBookFormGroup.value.page;
      this.book.price = this.addBookFormGroup.value.price;
      this.book.language = this.addBookFormGroup.value.language;
      this.book.condition = this.addBookFormGroup.value.condition;
      this.book.image = this.bodyData.dbPath;
    } else {
      if (this.addBookFormGroup.value.state === 'Activa') {
        this.addBookFormGroup.value.state = false;
      }
      if (this.addBookFormGroup.value.state === 'Vanduta') {
        this.addBookFormGroup.value.state = true;
      }

      this.book.isbn = this.addBookFormGroup.value.isbn;
      this.book.title = this.addBookFormGroup.value.title;
      this.book.author = this.addBookFormGroup.value.author;
      this.book.publisher = this.addBookFormGroup.value.publisher;
      this.book.publicationDate = this.addBookFormGroup.value.publicationDate;
      this.book.category.name = this.addBookFormGroup.value.category;
      this.book.page = this.addBookFormGroup.value.page;
      this.book.language = this.addBookFormGroup.value.language;
      this.book.condition = this.addBookFormGroup.value.condition;
      this.book.isSold = this.addBookFormGroup.value.state;

      this.selectedCategory = await this.categoryService.getCategoryByName$(
        this.book.category.name
      );
    }

    var userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    );

    if (this.editMode === false) {
      this.bookService
        .addBook$(
          this.book.isbn,
          userLogged['nameid'],
          this.book.title,
          this.book.author,
          this.book.publisher,
          this.book.publicationDate,
          this.book.page,
          this.book.price,
          this.book.language,
          this.book.condition,
          this.book.category.categoryId,
          this.book.image,
          false
        )
        .subscribe(
          (data) => {
            this.dialogRef.close('save');
            this.commonService.showSnackBarMessage(
              'Carte adăugată cu succes',
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
        categoryId: this.selectedCategory.categoryId,
        isbn: this.book.isbn,
        title: this.book.title,
        author: this.book.author,
        publisher: this.book.publisher,
        publicationDate: this.book.publicationDate,
        page: this.book.page,
        language: this.book.language,
        condition: this.book.condition,
        isSold: this.book.isSold,
      };

      this.bookService.updateBook$(this.currentBook.id, model).subscribe(
        (data) => {
          this.commonService.showSnackBarMessage(
            'Carte editată cu succes',
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

  change(event) {
    if (event.isUserInput) {
    }
  }
}
