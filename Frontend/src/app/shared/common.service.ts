import { Injectable } from '@angular/core';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable()
export class CommonService {
  constructor(private snackBar: MatSnackBar) {}

  loadImage(src: string) {
    return new Promise((resolve) => {
      resolve(src);
    });
  }

  showSnackBarMessage(
    message: string,
    horizontalPosition: MatSnackBarHorizontalPosition,
    verticalPosition: MatSnackBarVerticalPosition,
    duration,
    type: string
  ): void {
    this.snackBar.open(message, 'close', {
      horizontalPosition,
      verticalPosition,
      duration,
      panelClass: [type],
    });
  }
}
