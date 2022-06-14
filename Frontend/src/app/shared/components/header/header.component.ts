import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from '../../common.service';
import { AuthenticationComponent } from '../authentication/authentication.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewChecked {
  states: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  properties: Array<string> = ['Titlu', 'Autor', 'Editura'];
  searchProperty: string = '';
  currentUser: User = new User();
  currentRoleIsAdmin = false;
  currentRoleIsUser = false;
  currentUser$: Observable<User> = this.userService.currentUser$;
  searchFormGroup: FormGroup;
  adminTable: string = '';

  searchedTitle(title: string) {
    this.bookService.setCurrentProperty(this.searchProperty);
    this.bookService.setCurrentValue(title);
    this.router.navigate(['/book-list']);
  }

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.currentUser$.subscribe((data) => {
      this.currentUser = data;

      if (this.currentUser.role === 'Admin') {
        this.currentRoleIsAdmin = true;
        this.currentRoleIsUser = false;
      } else {
        this.currentRoleIsAdmin = false;
        this.currentRoleIsUser = true;
      }
    });
  }
  isOnTop = true;
  isLoggedIn$ = this.userService.isLoggedIn$;

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

  change(event) {
    this.searchProperty = event.source.value;
  }
}
