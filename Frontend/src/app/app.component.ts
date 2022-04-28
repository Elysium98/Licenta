import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { asyncScheduler, Observable } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { LoaderService } from './shared/components/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BookApp';

  constructor(
    public loaderService: LoaderService,
    private httpClient: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  isLoading$: Observable<boolean>;

  // this.changeDetector.detectChanges();
}
// ngAfterContentInit() {
//   setTimeout(() => console.log('Place what you want here'), 0);
// }
