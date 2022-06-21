import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-create-favorite-foods',
  templateUrl: './create-favorite-foods.page.html',
  styleUrls: ['./create-favorite-foods.page.scss'],
})
export class CreateFavoriteFoodsPage implements OnInit {
  user;
  foodForm: FormGroup;
  image = null;
  imageUrlView = null;

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
    console.log(this.user.uid);
    this.foodForm = this.formBuilder.group({
      nameFood: [null, [Validators.required]],
      mainIngredients: [null, [Validators.required]],
    });
  }

  async registerFood() {
    if(this.image != null){
      const loading = await this.loadingController.create();
      await loading.present();

      const imageName = this.imageName();

      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);

      const pathFoodData = `comidas/${imageName}.png`;
      const imgUrl = await this.dbService.uploadImage(this.image, pathFoodData);
      if (imgUrl) {
        const result = await this.dbService.uploadDadosComida(
          `comidas/${imageName}`,
          this.foodForm.value.nameFood,
          this.foodForm.value.mainIngredients,
          today.toLocaleDateString(),
          this.user.uid
        );
        if (result) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
          await loading.dismiss();
        } else {
          await loading.dismiss();
          this.presentAlert(
            'Falha ao salvar comida favorita',
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
    }else{
      this.presentAlert(
        'Imagem nâo selecionada',
        'Por favor, selecione uma imagen antes de continuar!'
      );
    }

  }

  async choseImage() {
    this.image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.imageUrlView = 'data:image/jpg;base64,' + this.image.base64String;
  }

  imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  ngOnInit() {}
  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }

  openPageHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
