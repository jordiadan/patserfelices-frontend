import { Component, Input } from '@angular/core';

import { PopoverController, NavParams, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: `
    <ion-list>
      <ion-item button (click)="removePost()">
        <ion-label>Eliminar</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {

  @Input("id") id;
  constructor(
    public popoverCtrl: PopoverController,
    public http: HttpClient,
    public navParams: NavParams,
    public navCtrl: NavController
  ) { }

  removePost() {
    console.log(this.id);
    this.http.delete(`${environment.serverURL}/posts/${this.id}`).subscribe(_ => {
      console.log('Deleted: ' + this.id);
      this.popoverCtrl.dismiss();
      this.navCtrl.back();
    })
  }
}
