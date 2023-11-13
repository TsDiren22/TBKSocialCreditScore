import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { RewardsComponent } from './rewards/rewards.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  {
    path: 'counter',
    component: CounterComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'rewards', component: RewardsComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
