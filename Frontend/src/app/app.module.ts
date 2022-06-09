import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeComponent } from './components/home/home.component';
import { MatCarouselModule } from 'ng-mat-carousel';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticationComponent } from './shared/components/authentication/authentication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterceptorService } from './shared/components/loader/interceptor.service';
import { LoaderService } from './shared/components/loader/loader.service';
import { UserService } from './services/user.service';
import { MatTableModule } from '@angular/material/table';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { MatMenuModule } from '@angular/material/menu';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';

import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService } from './shared/common.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyBooksComponent } from './components/user/my-books/my-books.component';
import { HistoryBooksComponent } from './components/user/history-books/history-books.component';
import { DatePipe } from '@angular/common';

import { EditImageComponent } from './components/admin/edit-image/edit-image.component';

import { AddUserByAdminComponent } from './components/admin/add-user/add-user.component';
import { AddRoleByAdminComponent } from './components/admin/add-role/add-role.component';
import { AddCategoryByAdminComponent } from './components/admin/add-category/add-category.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContactComponent } from './components/contact/contact.component';
import { AddBookByAdminComponent } from './components/admin/add-book/add-book.component';

export function initializeApp(userService: UserService) {
  return (): Promise<any> => {
    return userService.initializeUser();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AuthenticationComponent,
    AddBookComponent,
    AdminPanelComponent,
    UserProfileComponent,
    BookListComponent,
    BookDetailComponent,
    EditProfileComponent,
    MyBooksComponent,
    HistoryBooksComponent,
    EditImageComponent,
    AddBookByAdminComponent,
    AddUserByAdminComponent,
    AddRoleByAdminComponent,
    AddCategoryByAdminComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCarouselModule,
    MatToolbarModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    ScrollingModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    LayoutModule,
    FlexLayoutModule,
    MatTableModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDatepickerModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [UserService],
      multi: true,
    },
    DatePipe,
    CommonService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
