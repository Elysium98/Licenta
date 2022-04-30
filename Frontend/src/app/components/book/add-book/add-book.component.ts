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
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { IUser } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';

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
  book: Book = new Book();
  categories: Category[] = [];
  users: IUser[] = [];
  // categorySelected: Category = new Category();
  //currentCategory: Category = new Category();
  selectedCategory: string = '';
  selectedUser: string = '';
  states: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  helper = new JwtHelperService();
  public message: string;
  public progress: number;
  public response: { dbPath: '' };
  @Output() public onUploadFinished = new EventEmitter();
  formData = new FormData();
  bodyData: any;

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];

    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.http
      .post('https://localhost:7295/books/saveFile', this.formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.bodyData = event.body;
            console.log(this.bodyData);
            console.log(typeof this.bodyData);
            this.onUploadFinished.emit(event.body);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err),
      });
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.addBookFormGroup = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.maxLength(100)],
      publishing: ['', Validators.required],
      category: ['', Validators.required],
      page: ['', Validators.required],
      language: ['', Validators.required],
      state: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit() {
    this.book.title = this.addBookFormGroup.value.title;
    this.book.author = this.addBookFormGroup.value.author;
    this.book.publishing = this.addBookFormGroup.value.publishing;
    this.book.category = this.addBookFormGroup.value.category;
    this.book.page = this.addBookFormGroup.value.page;
    this.book.language = this.addBookFormGroup.value.language;
    this.book.status = this.addBookFormGroup.value.state;
    this.book.image = this.bodyData.dbPath;

    var userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    );
    console.log('in add book' + JSON.stringify(userLogged['nameid']));

    this.bookService
      .addBook$(
        this.generateUUID(),
        userLogged['nameid'],
        this.book.title,
        this.book.author,
        this.book.publishing,
        this.book.page,
        this.book.language,
        this.book.status,
        this.book.category.categoryId,
        this.book.image
      )
      .subscribe(
        (data) => {
          console.log('response', data);
        },
        (error) => console.log('error', error)
      );
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

//     this.addBookFormGroup = Object();
//     this.currentCategory = new Category();

//     this.route.params.subscribe((params) => {
//       this.bookId = params['id'] ? params['id'] : 0;
//     });
//     this.book = new Book();
//     this.addBookFormGroup = this.fb.group({
//       name: [this.book.title, Validators.required],
//       author: [this.book.author, Validators.maxLength(100)],
//       publishing: [this.book.publishing, Validators.required],
//       category: [this.book.category.name, Validators.required],
//       page: [this.book.page, Validators.required],
//       language: [this.book.language, Validators.required],
//       status: [this.book.status, Validators.required],
//     });

//     this.categoryService.getCategories$().subscribe((categories) => {
//       this.categories = categories;
//     });
//   }

//   selectedUserHandler(selected: any) {
//     this.selectedUser = selected.value;
//   }

//   selectedCategoryHandler(selected: any) {
//     this.selectedCategory = selected.value;
//   }

//   generateUUID() {
//     this.uuidValue = UUID.UUID();
//     return this.uuidValue;
//   }

//   async ngOnInit(): Promise<void> {
//     if (this.bookId == '0') {
//       this.book = new Book();
//     } else {
//       const currentItem = await this.getBookById();
//     }
//     this.editMode = this.bookId != '0' ? true : false;

//     this.addBookFormGroup = this.fb.group({
//       title: [this.book.title, Validators.required],
//       author: [this.book.author, Validators.maxLength(100)],
//       publishing: [this.book.publishing, Validators.required],
//       category: [this.book.category.name, Validators.required],
//       page: [this.book.page, Validators.required],
//       language: [this.book.language, Validators.required],
//       status: [this.book.status, Validators.required],
//     });
//   }
//   async getBookById() {
//     this.book = await this.bookService.getBookById$(this.bookId);
//     return this.book;
//   }

//   onFormSubmit(form: NgForm) {
//     console.log(form);
//   }
//   async getCategory(name: string) {
//     this.currentCategory = await this.categoryService.getCategoryByName$(name);
//     return this.currentCategory;
//   }

//   async onSubmit() {
//     this.book.id = '';
//     this.book.title = this.addBookFormGroup.value.name;
//     this.book.author = this.addBookFormGroup.value.author;
//     this.book.publishing = this.addBookFormGroup.value.publishing;
//     this.book.category.name = this.addBookFormGroup.value.category;
//     this.book.page = this.addBookFormGroup.value.page;
//     this.book.language = this.addBookFormGroup.value.language;
//     this.book.status = this.addBookFormGroup.value.status;

//     const selectedCategory = await this.getCategory(this.book.category.name);
//     this.currentCategory = selectedCategory;
//     console.log('Categorie curenta' + this.currentCategory.name);
//     console.log('Categorie selectata ' + selectedCategory.name);

//     if (this.bookId == '0') {
//       this.book = new Book(this.addBookFormGroup.value);
//       let test = this.bookService.addBook$(
//         this.generateUUID(),
//         this.book.title,
//         this.book.author,
//         this.book.publishing,
//         this.book.page,
//         this.book.language,
//         this.book.status,
//         this.currentCategory
//       );

//       console.log();

//       this.router.navigate(['**']);
//     } else {
//       const bookToUpdate = {
//         id: this.bookId,
//         title: this.book.title,
//         author: this.book.author,
//         publishing: this.book.publishing,
//         page: this.book.page,
//         language: this.book.language,
//         status: this.book.status,
//         category: this.book.category,
//       } as Book;
//       this.bookService.editBook$(bookToUpdate).subscribe();
//       this.router.navigate(['**']);
//     }
//   }
//   hasError(controlName: string, errorName: string) {
//     return this.addBookFormGroup.controls[controlName].hasError(errorName);
//   }
// }
