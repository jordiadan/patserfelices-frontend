import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConferenceData} from '../../providers/conference-data';
import {CommentOptions} from '../../interfaces/comment-options';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
  styleUrls: ['./activity-detail.scss'],
})
export class ActivityDetailPage {
  activity: any;
  comment: CommentOptions = { username: '', text: ''};

  constructor(
    private dataProvider: ConferenceData,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      const activityId = this.route.snapshot.paramMap.get('activityId');
      if (data && data.activities) {
        for (const activity of data.activities) {
          if (activity && activity.id === activityId) {
            this.activity = activity;
            break;
          }
        }
      }
    });

    // const activities = this.dataProvider.getActivities();
    // const activityId = this.route.snapshot.paramMap.get('activityId');
    // console.log('Activity ID: ' + activityId);
    // console.log(activities);
    //
    // for (const activity of activities) {
    //   console.log(activity.id + ' ' + activityId);
    //   if (activity && activity.id === activityId) {
    //     console.log('Equals');
    //     this.activity = activity;
    //     break;
    //   }
    // }
  }

  likePost() {

  }

  sendComment(form: NgForm) {
    console.log(this.activity.comments);
    this.activity.comments.push(this.comment);
    form.reset();

    console.log(this.comment);
    // const post = this.dataProvider.getActivities().find(it_post =>  it_post.id === id);
    // console.log(post);
  }
}
