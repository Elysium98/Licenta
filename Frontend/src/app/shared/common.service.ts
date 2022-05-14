import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable()
export class CommonService {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  showSnackBarMessage(
    message: string,
    horizontalPosition: MatSnackBarHorizontalPosition,
    verticalPosition: MatSnackBarVerticalPosition,
    duration
  ): void {
    this.snackBar.open(message, 'close', {
      horizontalPosition,
      verticalPosition,
      duration,
    });
  }
}
