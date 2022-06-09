import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  bookId: string;
  book: Book;
  birthdate: Date;
  age: number;
  constructor(private route: ActivatedRoute, private bookService: BookService) {
    this.route.params.subscribe((params) => {
      this.bookId = params['id'] ? params['id'] : 0;
    });
  }

  async ngOnInit() {
    this.book = await this.bookService.getBookByIdAsync$(this.bookId);
    this.CalculateAge();
  }

  public CalculateAge(): void {
    var timeDiff = Math.abs(
      Date.now() - new Date(this.book.user.birthDate).getTime()
    );
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    console.log(this.age);
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };
}
