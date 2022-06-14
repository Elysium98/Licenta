import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UUID } from 'angular2-uuid';
import { BehaviorSubject } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { Image } from 'src/app/models/image';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  addBookFormGroup: FormGroup;
  bookId: string = '0';
  editMode: boolean = false;
  matTitle: string = '';
  buttonName: string = '';
  categories: Category[] = [];
  users: User[] = [];
  currentCategory: Category;
  selectedCategory: Category;
  selectedUser: string = '';
  conditions: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  states: Array<string> = ['Activa', 'Vanduta'];
  state: any;
  formData = new FormData();
  convertedDate: any;
  bodyData: any;
  currentBook: Book;
  book: Book = new Book();
  image: string = '';
  private _imageSubject = new BehaviorSubject(this.image);
  image$ = this._imageSubject.asObservable();
  imgUrl: string = '';
  image2: string = '../../../assets/img/new_books.png';
  image2$: Promise<any>;

  editImage(files) {
    if (files.length === 0) {
      return;
    }
    let imageToUpload = <File>files[0];

    this.bookService.saveImageBook$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          this.commonService.showSnackBarMessage(
            'Imaginea a fost editată cu succes !',
            'right',
            'bottom',
            3000,
            'notif-success'
          );
          this.bodyData = event.body;
          this.updateImageBook();
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  addBookPhoto(files) {
    if (files.length === 0) {
      return;
    }
    let imageToUpload = <File>files[0];

    this.bookService.saveImageBook$(imageToUpload).subscribe({
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

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    this.image2$ = this.commonService.loadImage(this.image2);
    this.route.params.subscribe((params) => {
      this.bookId = params['id'] ? params['id'] : 0;

      this.editMode = this.bookId != '0' ? true : false;
    });

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
      this.buttonName = 'Adăugați';
    } else {
      this.matTitle = 'Editați informațiile cărții';
      this.buttonName = 'Actualizați';
    }

    if (this.editMode === false) {
      this.addBookFormGroup = this.fb.group({
        isbn: ['', [Validators.required, Validators.pattern('[0-9]{13}')]],
        title: ['', Validators.required],
        author: ['', [Validators.required, Validators.maxLength(100)]],
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
      this.currentBook = await this.bookService.getBookByIdAsync$(this.bookId);

      this.imgUrl = await this.createImgPath();
      this._imageSubject.next(this.imgUrl);

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
        isbn: [this.currentBook.isbn, Validators.pattern('[0-9]{13}')],
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
  async createImgPath() {
    return await `https://localhost:7295/${this.currentBook.image}`;
  }

  hasAddError(controlName: string, errorName: string) {
    return this.addBookFormGroup.controls[controlName].hasError(errorName);
  }

  updateImageBook() {
    this.currentBook.image = this.bodyData.dbPath;

    let model: Image = {
      image: this.currentBook.image,
    };
    this.bookService.updatePhotoBook$(this.currentBook.id, model).subscribe(
      async (data) => {
        this.imgUrl = await this.createImgPath();
        this._imageSubject.next(this.imgUrl);
      },
      (error) => console.log('error', error)
    );
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
      this.book.price = this.addBookFormGroup.value.price;
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
      let model: Partial<Book> = {
        isbn: this.book.isbn,
        userId: userLogged['nameid'],
        title: this.book.title,
        author: this.book.author,
        publisher: this.book.publisher,
        publicationDate: this.book.publicationDate,
        page: this.book.page,
        price: this.book.price,
        language: this.book.language,
        condition: this.book.condition,
        categoryId: this.book.category.categoryId,
        image: this.book.image,
        isSold: false,
      };

      this.bookService.addBook$(model).subscribe(() => {
        // this.router.navigate(['/my-books']);

        this.commonService.showSnackBarMessage(
          'Cartea a fost adăugată cu succes !',
          'right',
          'bottom',
          4000,
          'notif-success'
        );
      });
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

      this.bookService.updateBook$(this.bookId, model).subscribe(() => {
        if (model.isSold === true) {
          this.router.navigate(['/history-books']);
        }
        this.commonService.showSnackBarMessage(
          'Cartea a fost actualizată cu succes !',
          'right',
          'bottom',
          4000,
          'notif-success'
        );
      });
    }
  }

  change(event) {
    if (event.isUserInput) {
    }
  }
}
