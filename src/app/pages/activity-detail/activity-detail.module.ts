import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityDetailPage } from './activity-detail';
import { ActivityDetailPageRoutingModule } from './activity-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ActivityDetailPageRoutingModule
  ],
  declarations: [
    ActivityDetailPage,
  ]
})
export class ActivityDetailModule { }
