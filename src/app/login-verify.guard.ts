import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginVerifyGuard implements CanActivate {
  constructor(private _router:Router , private _login:LoginService ) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
    if ( this._login.isLoggedIn() ) {
      console.log('is logged');
      
      this._router.navigate(['/main'])
      return false;

    }else{

      return true;
    }

  }
  
}
