import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkIsAdmin();
  }

  constructor(private userService: UserService, private router: Router) {}

  checkIsAdmin(): boolean {
    let decodedToken = this.userService.decodeToken(
      localStorage.getItem('token')
    );

    if (JSON.parse(JSON.stringify(decodedToken['role'])) === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
