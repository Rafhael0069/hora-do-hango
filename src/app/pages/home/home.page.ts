import { Component } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { DataUser } from 'src/app/models/data-user';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { DatabaseService } from 'src/app/services/database.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  image;
  profile = null;

  constructor(private menu: MenuController,
    private avatarService: AvatarService,
    private authService: AuthService,
    private auth: Auth,
    public photoService: PhotoService,
    private dbService: DatabaseService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController) {
      this.avatarService.getUserProfile().subscribe((data) => {
        this.profile = data;
      });
    }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  openPagePerfil(){
    this.router.navigateByUrl('/perfil', { replaceUrl: true });
  }

  openPageFavoriteFoods(){
    this.router.navigateByUrl('/favorite-foods', { replaceUrl: true });
  }

  openPageEspecialVote(){
    this.router.navigateByUrl('/vote-favorite', { replaceUrl: true });
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

}
