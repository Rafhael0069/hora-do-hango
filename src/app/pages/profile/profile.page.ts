import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  profile = null;
  image = null;
  imageUrlView = null;
  user;

  constructor(
    private auth: Auth,
    private dbService: DatabaseService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.user = this.auth.currentUser;
    this.dbService
      .getUserProfile(`usuarios/${this.user.uid}`)
      .subscribe((data) => {
        this.profile = data;
        this.imageUrlView = this.profile.imageUrl;
        this.displayUserData(data);
      });

    this.profileForm = this.formBuilder.group({
      name: [null],
      matriculation: [null],
      email: [null],
    });
  }

  async takePicture() {
    this.image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.imageUrlView = 'data:image/jpg;base64,' + this.image.base64String;
  }

  async saveDataUser() {
    const loading = await this.loadingController.create();
    await loading.present();

    const imgName = `${this.user.uid}.png`;
    const pathUserData = `usuarios/${this.user.uid}`;
    if (this.image != null) {
      const imgUrl = await this.dbService.uploadImage(
        this.image,
        `imageUsuarios/${this.user.uid}${imgName}.png`
      );
      if (imgUrl) {
        const result = await this.dbService.updateDadosUser(
          pathUserData,
          this.profileForm.value.name,
          this.profileForm.value.matriculation,
          this.profileForm.value.email,
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
      const result = await this.dbService.updateDadosUser(
        pathUserData,
        this.profileForm.value.name,
        this.profileForm.value.matriculation,
        this.profileForm.value.email,
        this.imageUrlView
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
    }
  }

  displayUserData(profile: any) {
    this.profileForm.controls.name.setValue(profile.name);
    this.profileForm.controls.matriculation.setValue(profile.matriculation);
    this.profileForm.controls.email.setValue(profile.email);
  }

  ngOnInit() {}
}
