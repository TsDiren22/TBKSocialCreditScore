import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CounterService } from '../counter/counter.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login: FormGroup = this.fb.group({
    username: '',
    password: '',
  });
  register: FormGroup = this.fb.group({
    name: [null], // Set default value here
    username: null,
    password: '',
    phone: null,
  });
  userList: User[] = [];

  constructor(
    private fb: FormBuilder,
    private counterService: CounterService
  ) {}

  async ngOnInit() {
    this.userList = await this.getAllUsers().toPromise();
    this.userList = this.userList.filter((user) => user.username != '');
  }

  getAllUsers(): Observable<any> {
    return this.counterService.getUsers();
  }

  signup() {
    console.log(this.register.value);
    // Perform additional actions as needed
  }

  signin() {
    console.log(this.login.value);
    // Perform additional actions as needed
  }
}
