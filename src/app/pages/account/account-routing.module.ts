import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPage } from './account';
import {AuthGuard} from '../../guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountPageRoutingModule { }
