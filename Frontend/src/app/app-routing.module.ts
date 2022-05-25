import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPropertyComponent } from './components/admin/add-property/add-property.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { HomeComponent } from './components/home/home.component';
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { HistoryBooksComponent } from './components/user/history-books/history-books.component';
import { MyBooksComponent } from './components/user/my-books/my-books.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'edit-book/:id', component: AddBookComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'admin-panel/:model', component: AdminPanelComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'my-books', component: MyBooksComponent },
  { path: 'history-books', component: HistoryBooksComponent },
  { path: 'book-list', component: BookListComponent },
  { path: 'book-detail', component: BookDetailComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
