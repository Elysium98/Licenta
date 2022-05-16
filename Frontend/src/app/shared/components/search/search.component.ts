import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() emitSearchedTitle = new EventEmitter<string>();
  @Output() emitSearchedProperty = new EventEmitter<string>();
  @Output() editMode = new EventEmitter<boolean>(false);
  states: Array<string> = ['Medie', 'Bună', 'Foarte bună'];
  message: string = '';
  properties: Array<string> = ['Titlu', 'Autor', 'Editura'];
  searchProperty: string = '';

  // user: Observable<User>;
  currentUser: User = new User();
  currentUser$: Observable<User> = this.userService.currentUser$;
  userLogged: User = this.userService.decodeToken(
    localStorage.getItem('token')
  );
  searchFormGroup: FormGroup;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      property: '',
    });
  }

  searchedTitle(title: string) {
    this.emitSearchedTitle.emit(title);
    this.emitSearchedProperty.emit(this.searchProperty);

    this.bookService.setCurrentProperty(this.searchProperty);
    this.bookService.setCurrentValue(title);
    console.log('searchedTitle() is ' + title);
    console.log('searched property ' + this.searchProperty);
    this.router.navigate(['/book-list']);
  }
  change(event) {
    console.log(event.source.value);

    this.searchProperty = event.source.value;
  }
}
