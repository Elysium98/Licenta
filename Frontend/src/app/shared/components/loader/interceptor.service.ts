import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.show();

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event.type == HttpEventType.Response) {
            if (event.status == 200) {
              this.loaderService.hide();
            }
          }
        },
        (error) => {
          this.loaderService.hide();
        }
      )
    );
  }
}
