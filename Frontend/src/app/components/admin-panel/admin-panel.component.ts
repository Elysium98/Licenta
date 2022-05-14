import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  users: User[];
  books: Book[];
  categories: Category[];
  books$: Observable<Book[]>;
  currentUser$: Observable<User> = this.userService.currentUser$;
  displayedColumns: string[] = [
    'email',
    'lastName',
    'firstName',
    'birthDate',
    'phoneNumber',
    'actions',
  ];

  displayedBooksColumns: string[] = [
    'title',
    'author',
    'publishing',
    'page',
    'language',
    'status',
    'category',
    'uploadedBy',
    'actions',
  ];

  displayedCategoriesColumns: string[] = ['name', 'actions'];
  orderByProp: string = '';
  orderByDirection: string = '';
  constructor(
    private userService: UserService,
    private bookService: BookService,
    private categoryService: CategoryService
  ) {}

  async ngOnInit() {
    this.getUsers();
    this.getCategories();
    this.getBooks();
    console.log(this.users);
    //this.books$ = this.bookService.getBooks$();
    this.books = await this.bookService.getBooksAsync$();
  }

  sortData(sort: Sort) {
    console.log('sort', sort);
    this.orderByProp = sort.active;
    this.orderByDirection = sort.direction;
    // this.fetch();
  }

  getCategories() {
    this.categoryService.getCategories$().subscribe((result) => {
      this.categories = result;
    });
  }
  getUsers() {
    this.userService.getUsers$().subscribe((result) => {
      this.users = result;
    });
  }

  getBooks() {
    this.bookService.getBooks$().subscribe((result) => {
      this.books = result;
    });
  }

  deleteUser(id: string) {
    // console.log('itemId', id);
    // console.log(typeof id);
    this.userService.deleteUser(id).subscribe();
  }

  deleteBook(id: string) {
    console.log('itemId', id);
    this.bookService.deleteBook(id).subscribe(() => {
      console.log('itemId deleted', id);
      this.getBooks();
    });
  }
}
