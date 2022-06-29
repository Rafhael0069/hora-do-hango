import { DatabaseService } from 'src/app/services/database.service';
import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private dbService: DatabaseService) {}

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
        this.dbService.presentAlert('Error', 'E-mail ja cadastrado');
      } else if (error.code === 'auth/weak-password') {
        this.dbService.presentAlert('Error', 'Essa senha é muito facil.');
      } else {
        this.dbService.presentAlert('Error', error.message);
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
        this.dbService.presentAlert('Error', 'Esse usuário foi desabilitado.');
      } else if (error.code === 'auth/user-not-found') {
        this.dbService.presentAlert('Error', 'Usuário não encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        this.dbService.presentAlert('Error', 'Senha incorreta. digite nivamente.');
      } else {
        this.dbService.presentAlert('Error', error.message);
      }
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }
}
