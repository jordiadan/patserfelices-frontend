import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';
import {AuthGuard} from '../../guards/auth/auth.guard';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: '../session-detail/session-detail.module#SessionDetailModule'
          }
        ]
      },
      {
        path: 'speakers',
        children: [
          {
            path: '',
            loadChildren: '../speaker-list/speaker-list.module#SpeakerListModule'
          },
          {
            path: 'session/:sessionId',
            loadChildren: '../session-detail/session-detail.module#SessionDetailModule'
          },
          {
            path: 'speaker-details/:speakerId',
            loadChildren: '../speaker-detail/speaker-detail.module#SpeakerDetailModule'
          }
        ]
      },
      {
        path: 'activities',
        children: [
          {
            path: '',
            loadChildren: '../activity-list/activity-list.module#ActivityListModule'
          },
          {
            path: 'session/:sessionId',
            loadChildren: '../session-detail/session-detail.module#SessionDetailModule'
          },
          {
            path: 'activity-details/:activityId',
            loadChildren: '../activity-detail/activity-detail.module#ActivityDetailModule'
          }
        ]
      },
      {
        path: 'contest',
        children: [
          {
            path: '',
            loadChildren: '../candidate-list/candidate-list.module#CandidateListModule'
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: '../map/map.module#MapModule'
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: '../about/about.module#AboutModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

