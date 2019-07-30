import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserData } from './user-data';
import { environment } from '../../environments/environment';
import { PhotoOptions } from '../interfaces/photo-options';

@Injectable({
  providedIn: 'root'
})
export class ConferenceData {
  data: any;

  constructor(public http: HttpClient, public user: UserData) {
  }

  load(): any {
    console.log(this.data);

    if (this.data) {
      console.log('Reloaded!');
      return of(this.data);
    } else {
      console.log('NOT relaoded...');
      return this.http
        .get('assets/data/data.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data;

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              const speaker = this.data.speakers.find(
                (s: any) => s.name === speakerName
              );
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  getTimeline(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
    return this.load().pipe(
      map((data: any) => {
        const day = data.schedule[dayIndex];
        day.shownSessions = 0;

        queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

        day.groups.forEach((group: any) => {
          group.hide = true;

          group.sessions.forEach((session: any) => {
            // check if this session should show or not
            this.filterSession(session, queryWords, excludeTracks, segment);

            if (!session.hide) {
              // if this session is not hidden then this group should show
              group.hide = false;
              day.shownSessions++;
            }
          });
        });

        return day;
      })
    );
  }

  filterSession(
    session: any,
    queryWords: string[],
    excludeTracks: any[],
    segment: string
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segment is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().pipe(
      map((data: any) => {
        return data.speakers.sort((a: any, b: any) => {
          const aName = a.name.split(' ').pop();
          const bName = b.name.split(' ').pop();
          return aName.localeCompare(bName);
        });
      })
    );
  }

  // getActivities() {
  //   return this.load().pipe(
  //     map((data: any) => {
  //       return data.activities.sort((a: any, b: any) => {
  //         const aCreatedAt = a.created_at;
  //         const bCreatedAt = b.created_at;
  //         return aCreatedAt > (bCreatedAt);
  //       });
  //     })
  //   );
  // }

  getActivities() {
    console.log('entra');
    return new Promise((resolve) => {
      this.load().subscribe( _ => {
        this.http.get(`${environment.serverURL}/posts`).subscribe(
          activities => {
            this.data.activities = activities;
            console.log(this.data);
            resolve(this.data.activities);
          });
      });
    })

    // return this.http.get(`${environment.serverURL}/posts`);
  }

  postPost(post: any) {
    return this.http.post(`${environment.serverURL}/posts`, post);
  }

  uploadFile(formData: FormData) {
    console.log('Trying to upload file...');
    // const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const headers = {
      'enctype': 'multipart/form-data; boundary=WebAppBoundary',
      'Content-Type': 'multipart/form-data; boundary=WebAppBoundary'
    };

    this.http.post(`${environment.serverURL}/files`, formData, { headers: headers }).subscribe(() => { }, (error => { console.log(error); }));
  }


  getPhotos() {
    this.http.get(`${environment.serverURL}/candidates`).subscribe((photos: any[]) => {
          console.log(photos);
    });
  }

  getCandidates() {
    this.getPhotos();
    return this.load().pipe(
      map((data: any) => {
        return data.candidates.sort((a: any, b: any) => {
          const aMediaId = a.media_id;
          const bMediaId = b.media_id;
          return aMediaId > (bMediaId);
        });
      })
    );
  }

  getTracks() {
    return this.load().pipe(
      map((data: any) => {
        return data.tracks.sort();
      })
    );
  }

  getMap() {
    return this.load().pipe(
      map((data: any) => {
        return data.map;
      })
    );
  }


}
