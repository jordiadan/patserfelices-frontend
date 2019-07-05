import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivityListPage } from './activity-list';
const routes: Routes = [
  {
    path: '',
    component: ActivityListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityListPageRoutingModule {}
