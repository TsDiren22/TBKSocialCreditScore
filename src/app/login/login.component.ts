import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CounterService } from '../counter/counter.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { LoginService } from './login.service.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginErrors: string | null = null;
  registrationErrors: string | null = null;

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
    private counterService: CounterService,
    private loginService: LoginService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.userList = await this.getAllUsers().toPromise();
    this.userList = this.userList.filter((user) => user.username != '');
  }

  getAllUsers(): Observable<any> {
    return this.counterService.getUsers();
  }

  signup() {
    const regex = new RegExp('^[+][0-9]*$');
    if (!regex.test(this.register.value.phone)) {
      this.registrationErrors = 'Phone number must have country code';
      return;
    }

    const newUser: any = this.userList.find(
      (user) => user.name == this.register.value.name
    );

    newUser.username = this.register.value.username;
    newUser.password = this.register.value.password;
    newUser.phone = this.register.value.phone;

    this.loginService.register(newUser).subscribe(
      (user) => {
        this.router.navigate(['/']);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      (error) => {
        // Registration failed
        if (error.status === 404 || error.status === 400) {
          console.log(error);
          this.registrationErrors = error.error.error;
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
  }

  async registerAccount(user: User) {
    return this.loginService.register(this.register.value).toPromise();
  }

  signin() {
    this.loginService
      .login(this.login.value.username, this.login.value.password)
      .subscribe(
        (user) => {
          // navigate to home page
          this.router.navigate(['/']);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
        (error) => {
          // Login failed
          if (error.status === 404 || error.status === 400) {
            this.loginErrors = "Password or username doesn't match";
          } else {
            console.error('Unexpected error:', error);
          }
        }
      );
  }
}
