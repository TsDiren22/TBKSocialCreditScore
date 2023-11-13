import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const isUser = await this.auth.isAuthenticated();

      if (!isUser) {
        this.router.navigate(['login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Authentication check failed:', error);
      this.router.navigate(['login']);
      return false;
    }
  }
}
