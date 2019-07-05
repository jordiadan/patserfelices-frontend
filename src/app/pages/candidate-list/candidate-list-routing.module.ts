import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {CandidateListPage} from './candidate-list';
const routes: Routes = [
  {
    path: '',
    component: CandidateListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateListPageRoutingModule {}
