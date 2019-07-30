import { Component, ViewEncapsulation, OnInit, Sanitizer } from '@angular/core';
import { Router } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { PostOptions } from '../../interfaces/post-options';
import { NgForm } from '@angular/forms';
import { UserData } from '../../providers/user-data';
import { LoadingController, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { FileOptions } from '../../interfaces/file-options';
import { resolve } from 'path';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
  styleUrls: ['./activity-list.scss'],
})
export class ActivityListPage implements OnInit {
  activities: any[] = [];
  post: PostOptions = { username: '', description: '', createdAt: null, likes: [], name: '', profilePicture: '', firstSurname: '', photo: '', blob: null, numberOfComments: null};
  newPost: PostOptions;
  path: String;

  public imageData: any;
  public myPhoto: any;
  public error: string;
  public url: string;
  private loading: any;

  constructor(
    private confData: ConferenceData,
    public router: Router,
    public userData: UserData,
    public loadingCtrl: LoadingController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
  ) {
    this.url = environment.serverURL;
  }

  ngOnInit() {
    this.loadData().then(() => {

      for (let activity of this.activities) {
        console.log(activity.photo);
        let path = activity.photo;

        this.http.get(`${environment.serverURL + path}`, { responseType: 'blob' }).subscribe(
          (response: Blob) => {
            console.log('Me rio de sergio dalma');
            console.log(response);
            let unsafeImageUrl = URL.createObjectURL(response);
            activity.blob = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
            this.myPhoto = activity.blob;
            // this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          }
        );
        this.checkLiked(activity);
      }

      console.log(this.activities);

    });

  }

  refreshData(event) {
    console.log('Begin async operation', event);

    this.loadData().then(() => {

      for (let activity of this.activities) {
        console.log(activity.photo);
        let path = activity.photo;

        this.http.get(`${environment.serverURL + path}`, { responseType: 'blob' }).subscribe(
          (response: Blob) => {
            console.log('Me rio de sergio dalma');
            console.log(response);
            let unsafeImageUrl = URL.createObjectURL(response);
            activity.blob = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
            this.myPhoto = activity.blob;
            // this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          }
        );
        this.checkLiked(activity);
      }
      event.target.complete();
      console.log(this.activities);
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
    this.ngOnInit();
  }

  loadData(): Promise<any> {
    return new Promise((resolve) => {
      this.confData.getActivities().then((activities: any[]) => {
          this.activities = activities;
          console.log(this.activities);
          resolve(this.activities);
      });
    })
  }

  sendPost(form: NgForm): Promise<any> {
    return new Promise((resolve) => {
      console.log(this.post.description);
      return this.userData.getUser().then((user: any) => {
        console.log(user);

        this.post.createdAt = new Date().getTime();
        this.post.username = user.username;
        this.post.profilePicture = user.profilePicture;
        this.post.name = user.name;
        this.post.firstSurname = user.firstSurname;
        this.post.likes = [];

        this.confData.postPost(this.post).subscribe((post: any) => {
          if(post.photo) {
            this.http.get(`${environment.serverURL + post.photo}`, { responseType: 'blob' }).subscribe(
              (response: Blob) => {
                console.log('Me rio de sergio dalma');
                console.log(response);
                let unsafeImageUrl = URL.createObjectURL(response);
                post.blob = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
                this.myPhoto = post.blob;
                // this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
                this.activities.unshift(post);
                this.imageData = undefined;
                // this.post = null;
                form.reset();
                this.post.blob = undefined;
                this.post.photo = undefined;
              }
            );
          } else {
            this.activities.unshift(post);
            form.reset();
          }

        });
      });
    });
  }

  submit(form: NgForm) {
    console.log(form);
    if (this.imageData === undefined) {
      console.log('No hay imagen');
      this.post.blob = null;
      this.sendPost(form);
    } else {
      console.log('Hay imagen (habría que borrarla)');
      this.uploadPhoto(this.imageData)
        .then(path => {
          console.log('La puta loko' + path);
          this.post.photo = path;
          this.sendPost(form)/* .then( _ => {
            // Reset image
            this.imageData = undefined;
          }); */
        }, (err) => { console.log(err) });
    }
  }

  takePhoto() {
    const camera: any = navigator['camera'];
    camera.getPicture(imageData => {
      this.imageData = imageData;
      this.myPhoto = this.convertFileSrc(imageData);
      // this.uploadPhoto(imageData).then(path => resolve(path));
    }, error => this.error = JSON.stringify(error), {
        quality: 100,
        destinationType: camera.DestinationType.FILE_URI,
        sourceType: camera.PictureSourceType.CAMERA,
        encodingType: camera.EncodingType.JPEG,
        correctOrientation: true
      });
  }

  selectPhoto(): void {
    const camera: any = navigator['camera'];
    camera.getPicture(imageData => {
      this.myPhoto = this.convertFileSrc(imageData);
      this.uploadPhoto(imageData);
    }, error => this.error = JSON.stringify(error), {
        sourceType: camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: camera.DestinationType.FILE_URI,
        quality: 100,
        encodingType: camera.EncodingType.JPEG,
      });
  }

  private convertFileSrc(url: string): string {
    if (!url) {
      return url;
    }
    if (url.startsWith('/')) {
      return window['WEBVIEW_SERVER_URL'] + '/_app_file_' + url;
    }
    if (url.startsWith('file://')) {
      return window['WEBVIEW_SERVER_URL'] + url.replace('file://', '/_app_file_');
    }
    if (url.startsWith('content://')) {
      return window['WEBVIEW_SERVER_URL'] + url.replace('content:/', '/_app_content_');
    }
    return url;
  }

  private async uploadPhoto(imageFileUri: any): Promise<string> {
    this.error = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Subiendo foto...'
    });

    this.loading.present();

    return new Promise((resolve) => {
      console.log('First promise...');
      window['resolveLocalFileSystemURL'](imageFileUri,
        entry => {
          entry['file'](async file => await this.readFile(file).then(path => {
            console.log('antes');
            resolve(path);
            console.log('después');
          }));
        });
    });
  }

  private readFile(file: any): Promise<string> {
    console.log('Second promise...');
    console.log(file);
    return new Promise((resolve) => {
      const reader = new FileReader();
      console.log('hola que tal');

      reader.onloadend = async () => {
        console.log('hola');
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], { type: file.type });
        formData.append('file', imgBlob, file.name);
        console.log(imgBlob);
        console.log(file.name);
        return await this.postData(formData).then(path => {
          resolve(path);
        });
      };

      // Make sure to handle error states
      reader.onerror = function (e: any) {
        console.log(e);
      };

      // reader.readAsText(file);
      reader.readAsArrayBuffer(file);

    });

  }

  private async postData(formData: FormData): Promise<string> {
    console.log('Third promise...');
    return new Promise((resolve) => {
      let headers = new HttpHeaders();

      this.http.post(`${environment.serverURL}/files`, formData)
        .pipe(finalize(() => this.loading.dismiss()))
        .subscribe((file: FileOptions) => {
          console.log(file);
          resolve('/files/' + file.id);
        });
    });
  }

  private async showToast(ok: boolean | {}) {
    if (ok === true) {
      console.log('Upload successful');
      const toast = await this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      console.log('Upload failed');
      const toast = await this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    this.error = errMsg;
    return throwError(errMsg);
  }

  checkLiked(activity) {
    this.userData.getUser().then((user: any) => {
      console.log('Username: ' + user.username);
      console.log('Username: ' + activity.username);

      activity.liked = activity.likes.includes(user.username);
      console.log('Liked: ' + activity.liked);
    });
  }

  likePost(event, activity) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);

    this.userData.getUser().then((user: any) => {
      this.http.post(`${environment.serverURL}/posts/${activity.id}/like/${user.username}`, {}).subscribe((likes: []) => {
        activity.likes = likes;
        this.checkLiked(activity);
      })
    });
  }
}
