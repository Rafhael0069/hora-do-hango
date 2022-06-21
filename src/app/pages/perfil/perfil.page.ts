import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  perfilForm: FormGroup;
  profile = null;
  image = null;
  imageUrlView = null;
  user;

  constructor(
    private auth: Auth,
    public photoService: PhotoService,
    private dbService: DatabaseService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.user = this.auth.currentUser;
    this.dbService
      .getUserProfile(`usuarios/${this.user.uid}`)
      .subscribe((data) => {
        this.profile = data;
        this.imageUrlView = this.profile.imageUrl;
        this.preenchendoCampos(data);
      });

    this.perfilForm = this.formBuilder.group({
      name: [null],
      email: [null],
    });
  }

  async changeImage() {

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
    const imgUrl = await this.dbService.uploadImage(
      this.image,
      `imageUsuarios/${this.user.uid}${imgName}.png`
    );
    if (imgUrl) {
      const result = await this.dbService.uploadDados(
        pathUserData,
        this.perfilForm.value.name,
        this.perfilForm.value.email,
        imgUrl
      );
      if (result) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
        await loading.dismiss();
      } else {
        await loading.dismiss();
        this.presentAlert(
          'Falha ao salvar dados de usuário',
          'Por favor, tente novamente!'
        );
      }
    } else {
      await loading.dismiss();
      this.presentAlert(
        'Falha ao salvar imagem',
        'Por favor, tente novamente!'
      );
    }

  }

  openPageHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  preenchendoCampos(profile: any) {
    this.perfilForm.controls.name.setValue(profile.name);
    this.perfilForm.controls.email.setValue(profile.email);
  }

  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }

  ngOnInit() {}
}
