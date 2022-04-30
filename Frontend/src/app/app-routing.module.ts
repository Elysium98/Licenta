import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { BookDetailComponent } from './components/book/book-detail/book-detail.component';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { HomeComponent } from './components/home/home.component';
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'book-list', component: BookListComponent },
  { path: 'book-detail', component: BookDetailComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
