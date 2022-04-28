import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  users: IUser[];

  currentUser$: Observable<IUser> = this.userService.currentUser$;
  displayedColumns: string[] = ['email', 'userName', 'fullName'];

  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log(this.currentUser$);
    this.getUsers();
    console.log(this.users);
  }

  getUsers() {
    this.userService.getUsers$().subscribe((result) => {
      this.users = result;
    });
  }
}
