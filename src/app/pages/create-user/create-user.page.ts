import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { ValidateConfirmPassword } from 'src/validators/confirmPassword';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {

  profile = null;
  image = null;
  imageUrlView = null;
  registerForm: FormGroup;

  constructor(
    private dbService: DatabaseService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        null,
        [Validators.required, Validators.minLength(5), ValidateConfirmPassword],
      ],
    });
  }

  async registerUser() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.registerForm.value);
    if (user) {
      const imgName = `${user.user.uid}.png`;
      const pathUserData = `usuarios/${user.user.uid}`;
      const imgUrl = await this.dbService.uploadImage(
        this.image,
        `imageUsuarios/${user.user.uid}${imgName}.png`
      );
      if (imgUrl) {
        const result = await this.dbService.uploadDadosUser(
          pathUserData,
          this.registerForm.value.name,
          this.registerForm.value.email,
          imgUrl
        );
        if (result) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
          await loading.dismiss();
        } else {
          await loading.dismiss();
          this.dbService.presentAlert(
            'Falha ao salvar dados de usuário',
            'Por favor, tente novamente!'
          );
        }
      } else {
        await loading.dismiss();
        this.dbService.presentAlert(
          'Falha ao salvar imagem',
          'Por favor, tente novamente!'
        );
      }
    } else {
      await loading.dismiss();
    }
  }

  async takePicture() {
    this.image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.imageUrlView = 'data:image/jpg;base64,' + this.image.base64String;
  }

  ngOnInit() {}
}
