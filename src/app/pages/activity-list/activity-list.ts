import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {ConferenceData} from '../../providers/conference-data';
import {CommentOptions} from '../../interfaces/comment-options';
import {PostOptions} from '../../interfaces/post-options';
import {NgForm} from '@angular/forms';
import {UserData} from '../../providers/user-data';

@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
  styleUrls: ['./activity-list.scss'],
})
export class ActivityListPage implements OnInit {
  activities: any[] = [];
  post: PostOptions = { username: '', description: '', createdAt: null, likes: null, name: '', profilePicture: '', firstSurname: ''};
  newPost: PostOptions;
  user: any;

  constructor(
    private confData: ConferenceData,
    public router: Router,
    public userData: UserData
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  refreshData(event) {
    console.log('Begin async operation', event);
    // this.loadData();
    this.confData.getActivities().subscribe((activities: any[]) => {
      this.activities = activities;
      event.target.complete();
    });
  }

  // ionViewDidEnter() {
  //   this.loadData();
  // }

  // on change event
  // ngOnChanges(){
  //   this.loadData();
  // }

  loadData() {
    this.confData.getActivities().subscribe((activities: any[]) => {
      this.activities = activities;
    });
  }

  sendPost(form: NgForm) {
    console.log(this.post.description);
    this.userData.getUser().then((user: any) => {
      console.log(user);

      this.post.createdAt = new Date().getTime();
      this.post.username = user.username;
      this.post.profilePicture = user.profilePicture;
      this.post.name = user.name;
      this.post.firstSurname = user.firstSurname;
      this.post.likes = 0;

      this.confData.postPost(this.post);
      const copy = Object.assign({}, this.post );
      this.activities.unshift(copy);

      console.log(this.post);
      form.reset();
    });

    // const post = this.dataProvider.getActivities().find(it_post =>  it_post.id === id);
    // console.log(post);
  }
}
