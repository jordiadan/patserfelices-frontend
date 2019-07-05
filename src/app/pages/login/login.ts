import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {UserData} from '../../providers/user-data';

import {UserOptions} from '../../interfaces/user-options';
import {AuthService} from '../../services/auth/auth.service';
import {catchError, finalize} from 'rxjs/operators';
import {LoadingController, NavController, ToastController} from '@ionic/angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit {
  login: UserOptions = {username: '', password: ''};
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    public authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
  }

  // onLogin(form: NgForm) {
  //   this.submitted = true;
  //
  //   if (form.valid) {
  //     console.log('trying to log in');
  //     this.userData.login(this.login.username);
  //     this.router.navigateByUrl('/app/tabs/schedule');
  //   }
  // }

  async onLogin(form: NgForm) {
    console.log(form);

    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Iniciando sesión...'
    });

    loading.present();

    this.authService
      .login(form.value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        () => {
          this.userData.login(this.login.username);
          this.router.navigateByUrl('/app/tabs/schedule');
        },
        error => this.handleError(error)
      );
  }


  onSignup() {
    this.router.navigateByUrl('/signup');
  }

  ngOnInit(): void {
  }

  async handleError(error: any) {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Credenciales incorrectas';
    } else {
      message = `Error inesperado: ${error.statusText}`;
    }

    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}
