import { Injectable } from '@angular/core';
import { async, asyncScheduler, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public _isLoadingSubject = new BehaviorSubject<boolean>(false);

  isLoading$ = this._isLoadingSubject.asObservable();

  // setLoadingState(isLoading: boolean) {
  //   this._isLoadingSubject.next(isLoading);
  // }

  show() {
    this._isLoadingSubject.next(true);
  }

  hide() {
    setTimeout(() => {
      this._isLoadingSubject.next(false);
    }, 500);
  }

  constructor() {}
}
