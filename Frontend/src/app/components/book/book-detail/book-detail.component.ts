import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<BookDetailComponent>,
    private bookService: BookService,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: Book
  ) {}
  books$: Observable<Book[]> | undefined;
  book: Book;

  ngOnInit() {
    this.book = this.data;
    console.log(this.data);
  }

  getBooks() {
    this.books$ = this.bookService.getBooks$();
  }
  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };
}
