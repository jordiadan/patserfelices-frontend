import * as core from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ConferenceData } from './conference-data';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';



@core.Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  user;

  constructor(
    public events: Events,
    public storage: Storage,
    public http: HttpClient
  ) {
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }


  login(username: string): Promise<any> {
    return this.getSelf(username).then(user => {
      return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
        console.log(user);
        this.setUser(user);
        return this.events.publish('user:login');
      });
    });
  }

  signup(username: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return this.events.publish('user:signup');
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  setUser(user: any): Promise<any> {
    return this.storage.set('user', user);
  }

  getUser(): Promise<string> {
    return this.storage.get('user').then((value) => {
      return value;
    });
  }

  setProfilePicture(profilePicture: string): Promise<string> {
    return this.storage.set('profilePicture', profilePicture);
  }

  getProfilePicture(): Promise<string> {
    return this.storage.get('profilePicture').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }

  // HTTP Calls

  getSelf(username: string) {
    return new Promise(resolve => {
      this.http.get(`${environment.serverURL}/users/${username}`).subscribe(user => {
        console.log(user);
        resolve(user);
      });
    });
  }
}
