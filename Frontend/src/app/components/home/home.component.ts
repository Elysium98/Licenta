import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Role } from 'src/app/models/role';
import { IUser } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  books$: Observable<Book[]> | undefined;
  roles: Role[] = [];
  users: IUser[] = [];
  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.getBooks();
  }
  slides = [
    { image: '../../assets/img/1.jpg' },
    { image: '../../assets/img/2.jpg' },
    { image: '../../assets/img/3.jpg' },
    { image: '../../assets/img/4.jpg' },
    { image: '../../assets/img/5.jpg' },
  ];

  getBooks() {
    this.books$ = this.bookService.getBooks$();
  }
}
