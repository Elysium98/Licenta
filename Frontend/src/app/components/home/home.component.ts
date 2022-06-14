import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';
import { BookDetailComponent } from '../book/book-detail/book-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  slides = [
    { image: '../../assets/img/first_image_gallery.jpg' },
    { image: '../../assets/img/second_image_gallery.jpg' },
  ];

  constructor(private bookService: BookService, public dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    this.books = await this.bookService.getBooksByStatusAsync(false);
  }

  createImgPath(serverPath: string) {
    return `https://localhost:7295/${serverPath}`;
  }

  getBookDetails(book: Book) {
    this.dialog.open(BookDetailComponent, {
      width: '860px',
      height: '680px',
      data: book,
    });
  }
}
