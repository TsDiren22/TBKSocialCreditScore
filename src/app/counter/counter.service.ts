// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private apiBaseUrl = 'http://localhost:3000'; // Replace with your Node.js server URL

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.apiBaseUrl}/read`);
  }

  saveData(data: any) {
    // Implement your HTTP POST request to save data to the server
    return this.http.post(`${this.apiBaseUrl}/write`, data);
  }
}
