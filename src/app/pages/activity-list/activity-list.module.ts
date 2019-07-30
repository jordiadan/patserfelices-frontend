import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';

import { ActivityListPage } from './activity-list';
import { ActivityListPageRoutingModule } from './activity-list-routing.module';
import {FormsModule} from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ActivityListPageRoutingModule,
    FormsModule,
  ],
  declarations: [ActivityListPage],
  providers: [
    FileTransfer,
    FileTransferObject,
    Camera,
  ]
})
export class ActivityListModule {}
