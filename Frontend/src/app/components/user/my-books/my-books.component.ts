import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/shared/common.service';
import { BookDetailComponent } from '../../book/book-detail/book-detail.component';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent implements OnInit {
  books$: Observable<Book[]> | undefined;
  roles: Role[] = [];
  users: User[] = [];
  test12: string = 'desc';
  books: Book[] = [];
  booksFiltered: Book[] = [];
  showEditBtn: boolean = false;
  userLogged: any;
  sortFormGroup: FormGroup;
  sortings: Array<string> = [
    'A-Z',
    'Z-A',
    'Preț crescător',
    'Preț descrescător',
  ];
  categories: Category[] = [];
  currentUser$: Observable<User> = this.userService.currentUser$;
  currentUser: User;

  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.currentUser$.subscribe((data) => (this.currentUser = data));
  }

  async ngOnInit() {
    this.sortFormGroup = this.fb.group({
      sorting: '',
      category: this.books.map((book) => book.category.name),
    });

    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
    });

    console.log(this.sortFormGroup.value.category);
    // this.searchedValue = await this.bookService.searchProperty$;

    //  this.bookService.getBooks$().subscribe((data) => (this.books = data));
    // this.books = await this.bookService.getBooksAsync$();
    this.books = await this.bookService.getBooksByUserAndStatusAsync$(
      this.currentUser.id,
      false
    );
    this.booksFiltered = this.books;
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };

  getBookById(book: Book) {
    const dialog = this.dialog.open(BookDetailComponent, {
      width: '860px',
      height: '680px',
      data: book,
    });
  }
  change(event) {
    switch (event.source.value) {
      case 'A-Z':
        this.books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        this.books.sort((a, b) => a.title.localeCompare(b.title)).reverse();
        break;
      case 'Preț crescător':
        this.books.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'Preț descrescător':
        this.books.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        '';
        break;
    }
  }

  async changeCategory(event) {
    this.books = await this.bookService.getBooksByCategoryAsync$(
      event.source.value
    );
  }
}
