import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ActivityListPage } from './activity-list';
import { ActivityListPageRoutingModule } from './activity-list-routing.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ActivityListPageRoutingModule,
    FormsModule
  ],
  declarations: [ActivityListPage],
})
export class ActivityListModule {}
