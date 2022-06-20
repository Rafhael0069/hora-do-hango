import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
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
  constructor(
    private auth: Auth,
    private avatarService: AvatarService,
    public photoService: PhotoService,
    private dbService: DatabaseService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
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
    const loading = await this.loadingController.create();
    await loading.present();

    const dataAtual = Date.now();

    const result = await this.dbService.uploadDadosComida(
      `comidas/${this.user.uid}`,
      this.foodForm.value.nameFood,
      this.foodForm.value.mainIngredients,
      this.user.uid,
    );
    if (result) {
      this.router.navigateByUrl('/favorite-foods', { replaceUrl: true });
      await loading.dismiss();
    } else {
      await loading.dismiss();
      this.presentAlert(
        'Falha ao salvar comida favorita',
        'Por favor, tente novamente!'
      );
    }
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
