import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UUID } from 'angular2-uuid';
import { BehaviorSubject } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { UpdateBook } from 'src/app/models/updateBook';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { Image } from 'src/app/models/image';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  addBookFormGroup: FormGroup;
  // book: Book;
  bookId: string = '0';
  editMode: boolean = false;
  matTitle: string = '';
  categories: Category[] = [];
  users: User[] = [];
  // categorySelected: Category = new Category();
  currentCategory: Category;
  selectedCategory: string = '';
  selectedUser: string = '';
  conditions: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  states: Array<string> = ['Activa', 'Vanduta'];
  state: any;
  helper = new JwtHelperService();
  public message: string;
  public progress: number;
  public response: { dbPath: '' };
  @Output() public onUploadFinished = new EventEmitter();
  formData = new FormData();
  convertedDate: any;
  bodyData: any;
  test60: boolean = false;
  currentBook: Book;
  book: Book = new Book();
  //imageToUpload: any;
  image: string = '';
  private _imageSubject = new BehaviorSubject(this.image);
  image$ = this._imageSubject.asObservable();
  imgUrl: string = '';
  changeTest60() {
    this.test60 = !this.test60;
  }

  // getImage(files) {
  //   if (files.length === 0) {
  //     return;
  //   }

  //   this.imageToUpload = <File>files[0];
  //   console.log(this.imageToUpload);
  // }

  // uploadFile() {
  //   this.bookService.saveImageBook$(this.imageToUpload).subscribe({
  //     next: (event) => {
  //       if (event.type === HttpEventType.Response) {
  //         //this.message = 'Upload success.';
  //         this.bodyData = event.body;
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => console.log(err),
  //   });
  // }
  uploadFile(files) {
    if (files.length === 0) {
      return;
    }
    let imageToUpload = <File>files[0];

    this.bookService.saveImageBook$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          //this.message = 'Upload success.';
          this.bodyData = event.body;
          this.updateBook();
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

    this.userService.uploadImage$(imageToUpload).subscribe({
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
    private http: HttpClient,
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private datePipe: DatePipe
  ) {
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
        language: [''],
        condition: [''],
        image: [''],
        state: [''],
      });
      this.categoryService.getCategories$().subscribe((categories) => {
        this.categories = categories;
      });
    }

    console.log(this.bookId);
    console.log(this.editMode);
  }

  async ngOnInit(): Promise<void> {
    if (this.editMode === false) {
      this.matTitle = 'Adaugă o carte';
    } else {
      this.matTitle = 'Editeaza o carte';
    }

    if (this.editMode === false) {
      this.addBookFormGroup = this.fb.group({
        isbn: ['', Validators.required],
        title: ['', Validators.required],
        author: ['', Validators.maxLength(100)],
        publisher: ['', Validators.required],
        publicationDate: ['', Validators.required],
        category: ['', Validators.required],
        page: ['', Validators.required],
        language: ['', Validators.required],
        condition: ['', Validators.required],
        image: ['', Validators.required],
      });

      this.categoryService.getCategories$().subscribe((categories) => {
        this.categories = categories;
      });
    } else {
      // this.bookService
      //   .getBookById$(this.bookId)
      //   .subscribe((data) => (this.currentBook = data));
      this.currentBook = await this.bookService.getBookByIdAsync$(this.bookId);
      console.log(JSON.stringify(this.currentBook));

      this.imgUrl = await this.createImgPath2();
      // this.createImgPath2();
      console.log('UURL BA' + this.imgUrl);
      this._imageSubject.next(this.imgUrl);
      // this.currentCategory = await this.categoryService.getCategoryByIdAsync$(
      //   this.currentBook.categoryId
      // );
      console.log(
        'categoria este' +
          JSON.parse(JSON.stringify(this.currentBook.category.name))
      );
      this.convertedDate = this.datePipe.transform(
        this.currentBook.publicationDate,
        'yyyy-MM-dd'
      );
      console.log('DATA ESTE' + this.convertedDate);

      this.currentCategory = this.currentBook.category;
      console.log(this.currentCategory.name);
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
        language: [this.currentBook.language],
        condition: [this.currentBook.condition],
        state: [this.state],
      });
    }
  }
  async createImgPath2() {
    return await `https://localhost:7295/${this.currentBook.image}`;
  }

  updateBook() {
    this.currentBook.image = this.bodyData.dbPath;

    let model: Image = {
      image: this.currentBook.image,
    };
    this.bookService.updatePhotoBook$(this.currentBook.id, model).subscribe(
      async (data) => {
        console.log('response', data);
        console.log(this.currentBook.image);
        this.imgUrl = await this.createImgPath2();
        this._imageSubject.next(this.imgUrl);
        // this.userService.getUsers$();
      },
      (error) => console.log('error', error)
    );
  }

  onSubmit() {
    if (this.editMode === false) {
      this.book.isbn = this.addBookFormGroup.value.isbn;
      this.book.title = this.addBookFormGroup.value.title;
      this.book.author = this.addBookFormGroup.value.author;
      this.book.publisher = this.addBookFormGroup.value.publisher;
      this.book.publicationDate = this.addBookFormGroup.value.publicationDate;
      this.book.category = this.addBookFormGroup.value.category;
      this.book.page = this.addBookFormGroup.value.page;
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
      console.log(this.addBookFormGroup.value.state);

      this.book.isbn = this.addBookFormGroup.value.isbn;
      this.book.title = this.addBookFormGroup.value.title;
      this.book.author = this.addBookFormGroup.value.author;
      this.book.publisher = this.addBookFormGroup.value.publisher;
      this.book.publicationDate = this.addBookFormGroup.value.publicationDate;
      this.book.category = this.addBookFormGroup.value.category;
      this.book.page = this.addBookFormGroup.value.page;
      this.book.language = this.addBookFormGroup.value.language;
      this.book.condition = this.addBookFormGroup.value.condition;
      this.book.isSold = this.addBookFormGroup.value.state;
    }

    var userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    );
    console.log('in add book' + JSON.stringify(userLogged['nameid']));
    if (this.editMode === false) {
      this.bookService
        .addBook$(
          this.book.isbn,
          // this.generateUUID(),
          userLogged['nameid'],
          this.book.title,
          this.book.author,
          this.book.publisher,
          this.book.publicationDate,
          this.book.page,
          this.book.language,
          this.book.condition,
          this.book.category.categoryId,
          this.book.image,
          false
        )
        .subscribe(
          (data) => {
            console.log('response', data);
            this.router.navigate(['/my-books']);
          },
          (error) => console.log('error', error)
        );
    } else {
      let model: UpdateBook = {
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

      this.bookService.updateBook$(this.bookId, model).subscribe(
        (data) => {
          console.log('response', data);
          this.router.navigate(['/my-books']);
        },
        (error) => console.log('error', error)
      );
    }
  }

  change(event) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);
    }
  }
  uuidValue: string = ' ';
  generateUUID() {
    this.uuidValue = UUID.UUID();
    return this.uuidValue;
  }
}
