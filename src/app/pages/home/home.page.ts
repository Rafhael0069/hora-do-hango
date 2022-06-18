import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private menu: MenuController,
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController) {}

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
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
