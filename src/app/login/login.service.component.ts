import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiBaseUrl = environment.key;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    const response = this.http
      .post<User>( // Specify the expected type as User
        `${this.apiBaseUrl}/login`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
    return response;
  }

  register(user: User): Observable<User> {
    const response = this.http
      .post<User>(
        `${this.apiBaseUrl}/register`,
        {
          name: user.name,
          username: user.username,
          password: user.password,
          phone: user.phone,
        },
        { withCredentials: true }
      )
      .pipe(
        tap((registeredUser: User) => {
          localStorage.setItem('user', JSON.stringify(registeredUser));
        })
      );

    return response;
  }

  validate() {
    return this.http.get(`${this.apiBaseUrl}/validate`, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.post(
      `${this.apiBaseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }
}
