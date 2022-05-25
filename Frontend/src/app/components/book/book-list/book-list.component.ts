import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/shared/common.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  books$: Observable<Book[]> | undefined;
  roles: Role[] = [];
  users: User[] = [];
  test12: string = 'desc';
  books: Book[] = [];
  booksFiltered: Book[] = [];
  booksFilteredCategory: Book[] = [];
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
  property: string = '';
  searchedValue: string = '';
  onSearch: boolean = false;
  searchedProperty$: Observable<string> = this.bookService.searchProperty$;
  searchedValue$: Observable<string> = this.bookService.searchValue$;
  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.sortFormGroup = this.fb.group({
      sorting: '',
      category: '',
    });
  }

  async ngOnInit(): Promise<void> {
    // this.books = await this.bookService.getBooksAsync$();
    this.books = await this.bookService.getBooksByStatusAsync$(false);
    this.booksFiltered = this.books;
    this.bookService.searchProperty$.subscribe((data) => {
      this.property = data;

      this.bookService.searchValue$.subscribe(async (res) => {
        (this.searchedValue = res), console.log(data, res);
        if (this.searchedValue === '') {
          this.sortFormGroup.reset();
          this.books = await this.bookService.getBooksByStatusAsync$(false);
        }
        // this.books = await this.bookService.getBooksAsync$();
        // this.booksFiltered = this.books;

        if (this.property === 'Titlu') {
          this.onSearch = true;
          this.books = this.booksFiltered.filter((t) =>
            t.title.toLowerCase().includes(this.searchedValue.toLowerCase())
          );
        }

        if (this.property === 'Autor') {
          this.onSearch = true;
          this.books = this.booksFiltered.filter((t) =>
            t.author.toLowerCase().includes(this.searchedValue.toLowerCase())
          );
        }

        if (this.property === 'Editura') {
          this.onSearch = true;
          this.books = this.booksFiltered.filter((t) =>
            t.publisher.toLowerCase().includes(this.searchedValue.toLowerCase())
          );
        }

        this.booksFilteredCategory = this.books;
      });
    });

    // this.searchedProperty$.subscribe((data) => (this.property = data));
    //   this.property = await this.bookService.getProfileObs();
    // this.bookService
    //   .getProfileObs()
    //   .subscribe((data) => (this.property = data));
    console.log('PROPRIETATEA ESTE ' + this.property);

    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
    });
    this.sortFormGroup = this.fb.group({
      sorting: '',
      // category: this.books.map((book) => book.category.name),
      category: '',
    });

    console.log(this.sortFormGroup.value.category);
    // this.searchedValue = await this.bookService.searchProperty$;

    //  this.bookService.getBooks$().subscribe((data) => (this.books = data));

    // this.getBooks();
    console.log(this.sortFormGroup.value.sorting);

    //this.property = await this.bookService.asyncExample();
    // this.property = await this.bookService.setCurrentValues();

    // this.searchedValue$.subscribe((data) => (this.searchedValue = data));
    //  this.books = this.books.filter((t) => t.title === 'marexa');
  }

  getBooks() {
    this.books$ = this.bookService.getBooks$();

    console.log(this.books);
    this.userLogged = this.userService.decodeToken(
      localStorage.getItem('token')
    )['nameid'];

    for (let book of this.books) {
      if (book.userId === this.userLogged) {
        this.showEditBtn = true;
      } else {
        this.showEditBtn = false;
      }
    }
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

  changeCategorySearch(event) {
    this.books = this.booksFilteredCategory.filter(
      (t) => t.category.name == event.source.value
    );
  }
}
