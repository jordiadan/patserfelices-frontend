import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {ActionSheetController} from '@ionic/angular';

import {ConferenceData} from '../../providers/conference-data';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PhotoOptions } from '../../interfaces/photo-options';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'candidate-list.html',
  styleUrls: ['./candidate-list.scss'],
})
export class CandidateListPage {
  @ViewChild('list') list: ElementRef;
  candidates: any[] = [];
  photos: PhotoOptions[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public router: Router,
    public http: HttpClient
  ) {
  }

  ionViewDidEnter() {
    this.load();
    this.confData.getCandidates().subscribe((candidates: any[]) => {
      this.candidates = candidates;
      this.loadEmbeds();
    });
    
  }

  async load() {
    console.log('antes');
    await this.insertInstagramScript();
    console.log('después');
  }

  async insertInstagramScript() {
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.setAttribute('src', 'http://platform.instagram.com/en_US/embeds.js');
    document.body.appendChild(script);
  }

  loadEmbeds() {
    const win = <any>window;
    if (win.instgrm && win.instgrm.Embeds) {
      win.instgrm.Embeds.process();
    }
  }

  getPhotos() {
    this.http.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=836526229.f5f15b4.f01bab538e8245afb3c5cc02a2ffd30d').subscribe((photos: PhotoOptions[]) => {
      this.photos = photos;
      console.log(photos);
      // this.getEmbbeds()
    })
  }

  getEmbbeds() {

  }
}
