import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityDetailPage } from './activity-detail';
import { ActivityDetailPageRoutingModule } from './activity-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import { PopoverPage } from '../activity-popover/activity-popover';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ActivityDetailPageRoutingModule
  ],
  declarations: [
    ActivityDetailPage,
    PopoverPage
  ],
  entryComponents: [PopoverPage],
})
export class ActivityDetailModule { }
