import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/shared/common.service';
import { AddBookByAdminComponent } from '../add-book/add-book.component';
import { AddCategoryByAdminComponent } from '../add-category/add-category.component';
import { AddRoleByAdminComponent } from '../add-role/add-role.component';
import { EditImageComponent } from '../edit-image/edit-image.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // users: User[];
  users: MatTableDataSource<User> = new MatTableDataSource();
  //books: Book[];
  books: MatTableDataSource<Book> = new MatTableDataSource();
  categories: MatTableDataSource<Category> = new MatTableDataSource();
  roles: MatTableDataSource<Role> = new MatTableDataSource();
  // categories: Category[];
  state: any;
  states: Array<string> = ['Activa', 'Vanduta'];
  books$: Observable<Book[]>;
  dataSource: MatTableDataSource<Book>;
  currentUser$: Observable<User> = this.userService.currentUser$;
  displayedColumns: string[] = [
    'email',
    'lastName',
    'firstName',
    'birthDate',
    'phoneNumber',
  ];

  displayedRolesColumns: string[] = ['name', 'actions'];

  displayedBooksColumns: string[] = [
    'isbn',
    'title',
    'author',
    'publisher',
    'publicationDate',
    'page',
    'language',
    'condition',
    'image',
    'price',
    'category',
    'uploadedBy',
    'state',
    'actions',
  ];

  displayedCategoriesColumns: string[] = ['name', 'actions'];
  books_header: string[] = ['books_header'];
  users_header: string[] = ['users_header'];
  roles_header: string[] = ['roles_header'];
  categories_header: string[] = ['categories_header'];
  orderByProp: string = '';
  orderByDirection: string = '';
  booksTable: boolean = false;
  categoriesTable: boolean = false;
  usersTable: boolean = false;
  rolesTable: boolean = false;
  propertyFromHeader: string = '';
  constructor(
    private userService: UserService,
    private bookService: BookService,
    private roleService: RoleService,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getUsers();
    this.getCategories();
    this.getBooks();
    this.getRoles();

    this.route.params.subscribe((params) => {
      this.propertyFromHeader = params['model'];

      if (this.propertyFromHeader === 'books') {
        this.booksTable = true;
      } else {
        this.booksTable = false;
      }

      if (this.propertyFromHeader === 'categories') {
        this.categoriesTable = true;
      } else {
        this.categoriesTable = false;
      }

      if (this.propertyFromHeader === 'users') {
        this.usersTable = true;
      } else {
        this.usersTable = false;
      }

      if (this.propertyFromHeader === 'roles') {
        this.rolesTable = true;
      } else {
        this.rolesTable = false;
      }
    });
  }

  openRoleDialog() {
    this.dialog
      .open(AddRoleByAdminComponent, {
        width: '500px',
        height: 'auto',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getRoles();
        }
      });
  }

  openEditRoleDialog(role: Role) {
    this.dialog
      .open(AddRoleByAdminComponent, {
        width: '500px',
        height: 'auto',
        data: role,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getRoles();
        }
      });
  }

  openCategoryDialog() {
    this.dialog
      .open(AddCategoryByAdminComponent, {
        width: '500px',
        height: 'auto',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getCategories();
        }
      });
  }

  openEditCategoryDialog(category: Category) {
    this.dialog
      .open(AddCategoryByAdminComponent, {
        width: '500px',
        height: 'auto',
        data: category,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getCategories();
        }
      });
  }

  openBookDialog() {
    this.dialog
      .open(AddBookByAdminComponent, {
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getBooks();
        }
      });
  }

  openBookDialogEdit(book: Book) {
    this.dialog
      .open(AddBookByAdminComponent, {
        width: '800px',
        height: 'auto',
        data: book,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getBooks();
        }
      });
  }

  openImageDialogEdit(book: Book) {
    this.dialog
      .open(EditImageComponent, {
        width: '460px',
        height: 'auto',
        data: book,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getBooks();
        }
      });
  }

  getCategories() {
    this.categoryService.getCategories$().subscribe((result) => {
      this.categories = new MatTableDataSource(result);
      this.categories.paginator = this.paginator;
    });
  }
  getUsers() {
    this.userService.getUsers$().subscribe((result) => {
      this.users = new MatTableDataSource(result);
      this.users.paginator = this.paginator;
    });
  }

  getBooks() {
    this.bookService.getBooks$().subscribe((result) => {
      // this.books = result;
      this.books = new MatTableDataSource(result);
      this.books.paginator = this.paginator;
    });
  }

  getRoles() {
    this.roleService.getRoles$().subscribe((result) => {
      // this.books = result;
      this.roles = new MatTableDataSource(result);
      this.roles.paginator = this.paginator;
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.getUsers();
      this.commonService.showSnackBarMessage(
        'Utilizatorul a fost șters cu succes !',
        'center',
        'bottom',
        4000,
        'notif-success'
      );
    });
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(id).subscribe(() => {
      this.getBooks();
      this.commonService.showSnackBarMessage(
        'Cartea a fost ștearsă cu succes !',
        'center',
        'bottom',
        4000,
        'notif-success'
      );
    });
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.getCategories();
      this.commonService.showSnackBarMessage(
        'Categoria a fost ștearsă cu succes !',
        'center',
        'bottom',
        4000,
        'notif-success'
      );
    });
  }

  deleteRole(id: string) {
    this.roleService.deleteRole(id).subscribe(() => {
      this.getRoles();
      this.commonService.showSnackBarMessage(
        'Rolul a fost șters cu succes !',
        'center',
        'bottom',
        4000,
        'notif-success'
      );
    });
  }
}
