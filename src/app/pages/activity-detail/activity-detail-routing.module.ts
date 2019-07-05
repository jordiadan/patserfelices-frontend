import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ActivityDetailPage} from './activity-detail';

const routes: Routes = [
  {
    path: '',
    component: ActivityDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityDetailPageRoutingModule { }
