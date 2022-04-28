import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { UserService } from 'src/app/services/user.service';

import { AuthenticationComponent } from '../authentication/authentication.component';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewChecked {
  @ViewChild(CdkScrollable, { static: true }) scrollable: CdkScrollable;
  @ViewChild(MatSidenavContainer, { static: true })
  sidenavContainer: MatSidenavContainer;
  @ViewChild('toolBara', { static: true }) toolbar: MatToolbar;

  @Output() emitSearchedTitle = new EventEmitter<string>();

  searchedTitle(title: string) {
    this.emitSearchedTitle.emit(title);
    console.log('searchedTitle() is ' + title);
  }

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone,
    private loaderService: LoaderService
  ) {}
  isOnTop = true;
  isLoggedIn$ = this.userService.isLoggedIn$;
  isLoading$ = this.loaderService.isLoading$;
  ngAfterViewChecked(): void {
    this.userService.checkUserLogin().subscribe();
    // this.isLoggedIn.pipe(tap((data) => console.log(data)));
    this.cdr.detectChanges();
    // this.userService
    //   .checkLoggedIn()
    //   .subscribe((isAuth) => (this.isLoggedIn = isAuth));
    // this.checkLoggedIn();
  }

  // ngAfterViewInit() {
  //   this.scrollable.elementScrolled().subscribe(() => {
  //     const scrollTop =
  //       this.sidenavContainer.scrollable.getElementRef().nativeElement
  //         .scrollTop;
  //     if (scrollTop > 0) {
  //       this.toolbar._elementRef.nativeElement.classList.add('sticky');
  //       this.toolbar._elementRef.nativeElement.classList.remove('fixed');
  //       // console.log('SCroll', "sticky");
  //     } else {
  //       this.toolbar._elementRef.nativeElement.classList.add('fixed');
  //       this.toolbar._elementRef.nativeElement.classList.remove('sticky');
  //     }
  //   });
  // }

  // ngAfterViewInit() {
  //   this.scrollable.elementScrolled().subscribe(() => {
  //     console.log('merge');
  //     const scrollTop = this.scrollable.getElementRef().nativeElement.scrollTop;
  //     console.log(scrollTop);
  //     //make an HTTP call when it reaches to the end, to add some more data
  //   });
  //   this.zone.run(() => {
  //     console.log('to run change detection');
  //   });
  // }

  ngOnInit(): void {}

  // ngOnInit(): void {
  //   this.scrollDispatcher.scrolled().subscribe((event: CdkScrollable) => {
  //     const scroll = event.measureScrollOffset('top');
  //     let newIsOnTop = this.isOnTop;

  //     if (scroll > 0) {
  //       newIsOnTop = false;
  //     } else {
  //       newIsOnTop = true;
  //     }

  //     if (newIsOnTop !== this.isOnTop) {
  //       this.zone.run(() => {
  //         this.isOnTop = newIsOnTop;
  //       });
  //     }
  //   });
  // }

  logout() {
    this.userService.logout();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthenticationComponent, {
      width: '500px',
      height: '750px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
