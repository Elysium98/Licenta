import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  books$: Observable<Book[]> | undefined;
  books: Book[] = [];
  roles: Role[] = [];
  users: User[] = [];
  books2: any;
  sortings: Array<number> = [0, 1, 2, 3];
  constructor(private bookService: BookService) {}

  async ngOnInit(): Promise<void> {
    this.books = await this.bookService.getBooksAsync$();
    console.log(this.books);
  }
  slides = [
    { image: '../../assets/img/1.jpg' },
    { image: '../../assets/img/2.jpg' },
    { image: '../../assets/img/3.jpg' },
    { image: '../../assets/img/4.jpg' },
    { image: '../../assets/img/reading-challenge-hero.jpg' },
  ];

  getBooks() {
    this.books$ = this.bookService.getBooks$();
    this.books$.subscribe((data) => (this.books = data));
  }

  async getBooks$() {}

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };
}
