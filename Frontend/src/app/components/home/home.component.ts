import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from 'src/app/shared/common.service';
import { BookDetailComponent } from '../book/book-detail/book-detail.component';

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
  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {}

  async ngOnInit(): Promise<void> {
    this.books = await this.bookService.getBooksByStatusAsync$(false);
    console.log(this.books);

    // this.commonService.showSnackBarMessage(
    //   'Poză actualizată cu succes !',
    //   'right',
    //   'bottom',
    //   44000,
    //   'notif-success'
    // );
  }
  slides = [
    { image: '../../assets/img/test1.jpg' },
    { image: '../../assets/img/2.jpg' },
  ];

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };

  getBookDetails(book: Book) {
    const dialog = this.dialog.open(BookDetailComponent, {
      width: '860px',
      height: '680px',
      data: book,
    });
  }
}
