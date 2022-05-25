import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class CommonService {
  constructor(private snackBar: MatSnackBar) {}

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
