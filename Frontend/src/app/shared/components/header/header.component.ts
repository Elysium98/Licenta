import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
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
  @Output() emitSearchedProperty = new EventEmitter<string>();
  @Output() editMode = new EventEmitter<boolean>(false);
  states: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  message: string = '';
  properties: Array<string> = ['Titlu', 'Autor', 'Editura'];
  searchProperty: string = '';
  test12: string = '';
  // user: Observable<User>;
  currentUser: User = new User();
  currentUser$: Observable<User> = this.userService.currentUser$;
  userLogged: User = this.userService.decodeToken(
    localStorage.getItem('token')
  );
  searchFormGroup: FormGroup;

  searchedTitle(title: string) {
    // this.emitSearchedTitle.emit(title);
    // this.emitSearchedProperty.emit(this.searchProperty);

    this.bookService.setCurrentProperty(this.searchProperty);
    this.bookService.setCurrentValue(title);
    console.log('searchedTitle() is ' + title);
    console.log('searched property ' + this.searchProperty);
    this.router.navigate(['/book-list']);
  }

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {
    this.currentUser$.subscribe((data) => (this.currentUser = data));
    //this.message = 'Salut  ' + this.currentUser.firstName;
    //   console.log('DAAA' + this.currentUser);
  }
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

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      searchValue: '',
      property: '',
    });
  }

  goToHomePage() {
    this.searchFormGroup.reset();
    this.bookService.setCurrentProperty('');
    this.bookService.setCurrentValue('');

    this.router.navigate(['/home']);
  }
  goToBookList() {
    this.searchFormGroup.reset();
    this.bookService.setCurrentProperty('');
    this.bookService.setCurrentValue('');

    this.router.navigate(['/book-list']);
  }
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
      width: '530px',
      height: '850px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  checkEditMode() {
    let value: boolean = true;
    this.editMode.emit(value);
  }

  change(event) {
    console.log(event.source.value);

    this.searchProperty = event.source.value;
  }
}
