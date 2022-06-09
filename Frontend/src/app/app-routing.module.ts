import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookByAdminComponent } from './components/admin/add-book/add-book.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { HistoryBooksComponent } from './components/user/history-books/history-books.component';
import { MyBooksComponent } from './components/user/my-books/my-books.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AdminGuard } from './guards/admin.guard';
import { isLoggedInGuard } from './guards/logged-in.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [isLoggedInGuard],
  },
  { path: 'add-property', component: AddBookByAdminComponent },
  { path: 'edit-book/:id', component: AddBookComponent },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [isLoggedInGuard, AdminGuard],
  },
  {
    path: 'admin-panel/:model',
    component: AdminPanelComponent,
    canActivate: [isLoggedInGuard, AdminGuard],
  },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'user-profile/:id', component: UserProfileComponent },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'my-books',
    component: MyBooksComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'history-books',
    component: HistoryBooksComponent,
    canActivate: [isLoggedInGuard],
  },
  { path: 'book-list', component: BookListComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'book-detail', component: BookDetailComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
