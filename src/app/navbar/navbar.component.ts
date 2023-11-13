import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { LoginService } from '../login/login.service.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    const storage = localStorage.getItem('user');
    console.log(storage);
    if (storage != null) {
      this.currentUser = JSON.parse(storage);
    }
  }

  async logout() {
    await this.loginService.logout().toPromise();
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}
