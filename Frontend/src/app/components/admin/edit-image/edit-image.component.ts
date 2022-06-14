import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';
import { Image } from 'src/app/models/image';
import { CommonService } from 'src/app/shared/common.service';
@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
  bodyData: any;
  currentBook: Book;
  imgUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: Book,
    private bookService: BookService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.currentBook = this.data;
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:7295/${serverPath}`;
  };

  editImage(files) {
    if (files.length === 0) {
      return;
    }
    let imageToUpload = <File>files[0];

    this.bookService.saveImageBook$(imageToUpload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          this.bodyData = event.body;
          this.updateImageBook();
          this.dialogRef.close('success');

          this.commonService.showSnackBarMessage(
            'Poza a fost editată cu succes !',
            'center',
            'bottom',
            4000,
            'notif-success'
          );
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  updateImageBook() {
    this.currentBook.image = this.bodyData.dbPath;

    let model: Image = {
      image: this.currentBook.image,
    };
    this.bookService.updatePhotoBook$(this.currentBook.id, model).subscribe(
      async (data) => {
        console.log('response', data);
      },
      (error) => console.log('error', error)
    );
  }
}
