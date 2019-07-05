import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {ActionSheetController} from '@ionic/angular';

import {ConferenceData} from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'candidate-list.html',
  styleUrls: ['./candidate-list.scss'],
})
export class CandidateListPage {
  @ViewChild('list') list: ElementRef;
  candidates: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public router: Router
  ) {
  }

  ionViewDidEnter() {
    this.load();
    this.confData.getCandidates().subscribe((candidates: any[]) => {
      this.candidates = candidates;
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
    let win = <any>window;
    if (win.instgrm && win.instgrm.Embeds) {
      win.instgrm.Embeds.process();
    }
  }
}
