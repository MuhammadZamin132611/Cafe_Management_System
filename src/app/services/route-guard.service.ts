import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode'
import { GlobalConstants } from '../shared/global-constant';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,
    public router: Router,
    private snackebarService: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRolArray = route.data;
    expectedRolArray = expectedRolArray['expectedRole'];

    const token: any = localStorage.getItem('token');
    var tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token)
    } catch (erro) {
      localStorage.clear();
      this.router.navigate(['/']);
    }
    let checkRole = false;
    for (let i = 0; i < expectedRolArray['length']; i++) {
      if (expectedRolArray[i] == tokenPayload.role) {
        checkRole = true;
      }
    }
    if (tokenPayload.role == "user" || tokenPayload.role == "admin") {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackebarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    }
    else {
      this.router.navigate(['/'])
      localStorage.clear();
      return false;
    }
  }
}
