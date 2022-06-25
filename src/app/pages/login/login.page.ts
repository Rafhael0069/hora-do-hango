import { DatabaseService } from 'src/app/services/database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

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
    private loadingController: LoadingController,
    private dbService: DatabaseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.loginForm.value);

    if (user) {
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.loginForm.controls.password.setValue(null);
      this.dbService.presentAlert('Falha no login', 'Por favor, tente novamente!');
      await loading.dismiss();
    }
  }

  async ngOnInit() {
    this.loginForm.controls.email.setValue('rafhael@teste.com');
    this.loginForm.controls.password.setValue('123456');
  }
}
