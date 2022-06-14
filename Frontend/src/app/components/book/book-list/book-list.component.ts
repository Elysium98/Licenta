import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { Role } from 'src/app/models/role';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationComponent } from 'src/app/shared/components/authentication/authentication.component';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  roles: Role[] = [];
  booksToBeFilteredBySearch: Book[] = [];
  booksToBeFilteredByCategory: Book[] = [];
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
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private userService: UserService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.sortFormGroup = this.fb.group({
      sorting: '',
      category: '',
    });
  }

  async ngOnInit(): Promise<void> {
    this.books = await this.bookService.getBooksByStatusAsync(false);
    this.booksToBeFilteredBySearch = this.books;

    this.bookService.searchProperty$.subscribe((data) => {
      this.property = data;

      this.bookService.searchValue$.subscribe(async (res) => {
        this.searchedValue = res;

        if (this.searchedValue === '') {
          this.sortFormGroup.reset();
          this.books = await this.bookService.getBooksByStatusAsync(false);
        }

        switch (this.property) {
          case 'Titlu':
            this.books = this.booksToBeFilteredBySearch.filter((t) =>
              t.title.toLowerCase().includes(this.searchedValue.toLowerCase())
            );
            break;
          case 'Autor':
            this.books = this.booksToBeFilteredBySearch.filter((t) =>
              t.author.toLowerCase().includes(this.searchedValue.toLowerCase())
            );
            break;
          case 'Editura':
            this.books = this.booksToBeFilteredBySearch.filter((t) =>
              t.publisher
                .toLowerCase()
                .includes(this.searchedValue.toLowerCase())
            );
            break;
          default:
            '';
            break;
        }

        this.booksToBeFilteredByCategory = this.books;
      });
    });

    this.categoryService.getCategories$().subscribe((categories) => {
      this.categories = categories;
    });
    this.sortFormGroup = this.fb.group({
      sorting: '',
      category: '',
    });
  }

  goToAddBook() {
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['/add-book']);
    } else {
      this.dialog.open(AuthenticationComponent, {
        width: '530px',
        height: '850px',
      });
    }
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };

  getBookById(book: Book) {
    this.dialog.open(BookDetailComponent, {
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
    this.books = this.booksToBeFilteredByCategory.filter(
      (t) => t.category.name == event.source.value
    );
  }
}
