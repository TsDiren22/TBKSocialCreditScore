import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service.component';
import { environment } from 'environment';
import { User } from '../models/user';
@Injectable()
export class AuthService {
  private apiBaseUrl = environment.key;
  constructor(private http: HttpClient, private loginService: LoginService) {}
  public async isAuthenticated() {
    try {
      const result = await this.loginService.validate().toPromise();
      return !!result;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }
}
