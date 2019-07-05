import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CandidateListPage } from './candidate-list';
import { CandidateListPageRoutingModule } from './candidate-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CandidateListPageRoutingModule
  ],
  declarations: [CandidateListPage],
})
export class CandidateListModule {}
