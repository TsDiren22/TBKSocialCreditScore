import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { RewardsComponent } from './rewards/rewards.component';

const routes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: 'rewards', component: RewardsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
