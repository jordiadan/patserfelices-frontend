import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { CommentOptions } from '../../interfaces/comment-options';
import { NgForm } from '@angular/forms';
import { PopoverController, NavController } from '@ionic/angular';
import { PopoverPage } from '../activity-popover/activity-popover';
import { UserData } from '../../providers/user-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { post } from 'selenium-webdriver/http';
import { resolve } from 'path';

@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
  styleUrls: ['./activity-detail.scss'],
})
export class ActivityDetailPage {
  activity: any;
  comment: CommentOptions = { id: null, postId: null, username: '', text: '', createdAt: null, profilePicture: '', canDelete: false };
  comments: CommentOptions [];
  popover: boolean = false;
  liked: boolean = false;


  constructor(
    private dataProvider: ConferenceData,
    private router: Router,
    private route: ActivatedRoute,
    private userData: UserData,
    public popoverController: PopoverController,
    private http: HttpClient
  ) {
  }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      const activityId = +this.route.snapshot.paramMap.get('activityId');
      console.log(activityId);

      if (data && data.activities) {
        for (const activity of data.activities) {
          console.log(activity.id);

          if (activity && activity.id === activityId) {
            this.activity = activity;
            this.getComments(activityId).subscribe((comments:   CommentOptions[] ) => {
              this.comments = comments;
              for(let comment of this.comments) {
                this.checkCanDelete(comment).then((canDelete: boolean)=> {
                  comment.canDelete = canDelete;
                })
              }

            });
            this.checkCreator();
            this.checkLiked();
            break;
          }
        }
      }
    });
  }

  getComments(postId: number) {
    return this.http.get(`${environment.serverURL}/posts/${postId}/comments`);
  }

  sendComment(form: NgForm) {
    console.log(this.activity.comments);
    this.comment.createdAt = new Date().getTime();
    this.comment.postId = this.activity.id;
    this.userData.getUser().then((user: any) => {
      console.log(user);
      this.comment.username = user.username;
      this.comment.profilePicture = user.profilePicture;
      this.http.post(`${environment.serverURL}/comments`, this.comment).subscribe((comment: any) => {
        comment.canDelete = true;
        this.comments.push(comment);
        form.reset();
        console.log(comment);
      });
    });
  }

  async presentPopover(ev: any) {
    console.log('Activity details id: ' + this.activity.id);
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      translucent: true,
      componentProps: {
        id: this.activity.id
      }
    });
    return await popover.present();
  }

  checkCreator() {
    this.userData.getUser().then((user: any) => {
      console.log('Username: ' + user.username);
      console.log('Username: ' + this.activity.username);

      this.popover = this.activity.username === user.username;
    });
  }

  checkLiked() {
    this.userData.getUser().then((user: any) => {
      console.log('Username: ' + user.username);
      console.log('Username: ' + this.activity.username);

      this.liked = this.activity.likes.includes(user.username);
      console.log('Liked: ' + this.liked);
    });
  }

  checkCanDelete(comment) {
    return new Promise(resolve => {
      this.userData.getUser().then((user: any) => {
        console.log('Heyyyyy: ' + user);
        let canDelete = user.username === comment.username || user.username === this.activity.username;
        resolve(canDelete);
      });
    })
  }
  

  likePost() {
    console.log('like');
    this.userData.getUser().then((user: any) => {
      this.http.post(`${environment.serverURL}/posts/${this.activity.id}/like/${user.username}`, {}).subscribe((likes: []) => {
        this.activity.likes = likes;
        this.checkLiked();
      })
    });
  }

  deleteComment(commentId: number) {
    this.http.delete(`${environment.serverURL}/comments/${commentId}`).subscribe( _ => {
      this.comments = this.comments.filter(comment => comment.id !== commentId);
    })
  }

}
