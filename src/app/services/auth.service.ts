import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, public alertCtrl: AlertController) {}

  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        this.presentAlert('Error', 'E-mail ja cadastrado');
      } else if (error.code === 'auth/weak-password') {
        this.presentAlert('Error', 'Essa senha é muito facil.');
      } else {
        this.presentAlert('Error', error.message);
      }
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (error) {
      if (error.code === 'auth/user-disabled') {
        this.presentAlert('Error', 'Esse usuário foi desabilitado.');
      } else if (error.code === 'auth/user-not-found') {
        this.presentAlert('Error', 'Usuário não encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        this.presentAlert('Error', 'Senha incorreta. digite nivamente.');
      } else {
        this.presentAlert('Error', error.message);
      }
      return null;
    }
  }

  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }

  logout() {
    return signOut(this.auth);
  }
}
