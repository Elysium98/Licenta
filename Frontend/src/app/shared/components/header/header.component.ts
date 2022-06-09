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
import { CommonService } from '../../common.service';

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
  currentRoleIsAdmin = false;
  currentRoleIsUser = false;
  currentUser$: Observable<User> = this.userService.currentUser$;
  userLogged: User = this.userService.decodeToken(
    localStorage.getItem('token')
  );
  searchFormGroup: FormGroup;
  adminTable: string = '';

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
    private router: Router,
    private commonService: CommonService
  ) {
    this.currentUser$.subscribe((data) => {
      this.currentUser = data;

      console.log('TEST ' + this.currentUser.role);
      if (this.currentUser.role === 'Admin') {
        this.currentRoleIsAdmin = true;
        this.currentRoleIsUser = false;
      } else {
        this.currentRoleIsAdmin = false;
        this.currentRoleIsUser = true;
      }
    });

    //this.message = 'Salut  ' + this.currentUser.firstName;
    //   console.log('DAAA' + this.currentUser);
  }
  isOnTop = true;
  isLoggedIn$ = this.userService.isLoggedIn$;
  isLoading$ = this.loaderService.isLoading$;
  ngAfterViewChecked(): void {
    this.userService.checkUserLogin().subscribe();

    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      searchValue: '',
      property: '',
    });
  }

  goToAdminB() {
    this.adminTable = 'books';
    this.router.navigate(['/admin-panel', this.adminTable]);
  }

  goToAdminC() {
    this.adminTable = 'categories';
    this.router.navigate(['/admin-panel', this.adminTable]);
  }

  goToAdminR() {
    this.adminTable = 'roles';

    this.router.navigate(['/admin-panel', this.adminTable]);
  }

  goToAdminU() {
    this.adminTable = 'users';
    this.router.navigate(['/admin-panel', this.adminTable]);
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

  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
    this.commonService.showSnackBarMessage(
      'Ai fost delogat cu succes !',
      'center',
      'bottom',
      4000,
      'notif-success'
    );
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
