import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';

//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
     public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
  /* public afAuth: AngularFireAuth,
    public storage: Storage */
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  submitLogin() {
    /* this.afAuth
      .signInWithEmailAndPassword(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .then((response) => {
        //console.log(response);
        //this.presentAlert('Sucesso', 'Usuário autenticado com sucesso!');
        this.storage.set('user', response.user.uid).then(() => {
          this.navCtrl.navigateForward('start');
        });
        /*   .catch(() ={
          this.presentAlert('Sucesso', 'Usuário autenticado com sucesso!');
        }
        );
      })
      .catch((error) => {
        if (error.code === 'auth/user-disabled') {
          this.presentAlert('Error', 'Esse usuário foi desabilitado.');
        } else if (error.code === 'auth/user-not-found') {
          this.presentAlert('Error', 'Usuário não encontrado.');
        } else if (error.code === 'auth/wrong-password') {
          this.presentAlert('Error', 'Senha incorreta. digite nivamente.');
          this.loginForm.controls.password.setValue(null);
        } else {
          this.presentAlert('Error', error.message);
        }
      }); */
  }

  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }

  async ngOnInit() {
    //this.loginForm.controls.email.setValue('rafhael@teste.com');
    //this.loginForm.controls.password.setValue('123456');
    //await this.storage.create();
  }
}
