import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Role } from 'src/app/models/role';
import { IUser } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  books$: Observable<Book[]> | undefined;
  roles: Role[] = [];
  users: IUser[] = [];
  test12: string = 'desc';
  constructor(private bookService: BookService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.books$ = this.bookService.getBooks$();
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };

  getBookById(book: Book) {
    const dialog = this.dialog.open(BookDetailComponent, {
      width: '760px',
      height: '480px',
      data: book,
    });
  }
}
