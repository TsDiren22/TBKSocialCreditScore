// TODO: Add message to user DOESNT WORK!!!!

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable, map } from 'rxjs';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  //baseUrl from .env
  private apiBaseUrl = environment.key;

  constructor(private http: HttpClient) {}

  addMessageCount(messageAmount: number, userId: number) {
    return this.http.post(`${this.apiBaseUrl}/addMessageCount/${userId}`, {
      messageAmount,
    });
  }

  addLatestMessageDate(date: Date) {
    return this.http.post(`${this.apiBaseUrl}/addLatestMessageDate`, {
      date,
    });
  }

  addPoints(pointsToAdd: number, userId: number) {
    console.log('addPoints', pointsToAdd, userId);
    return this.http.post(`${this.apiBaseUrl}/addPoints/${userId}`, {
      pointsToAdd,
    });
  }

  createUser(user: User) {
    return this.http.post(`${this.apiBaseUrl}/createUser`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}/getUsers`);
  }

  fuseUsers(userId1: number, userId2: number) {
    return this.http.post(`${this.apiBaseUrl}/fuseUsers`, {
      userId1,
      userId2,
    });
  }

  getLatestMessageDate() {
    console.log(this.apiBaseUrl);
    return this.http.get(`${this.apiBaseUrl}/latestMessageDate`);
  }
}
