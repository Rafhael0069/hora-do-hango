import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  profile = {
    name: '',
    imageUrl: '',
  };

  user;
  foods: any[] = [];

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private auth: Auth,
    private dbService: DatabaseService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.user = this.auth.currentUser;
    this.dbService
      .getUserProfile(`usuarios/${this.user.uid}`)
      .subscribe((data) => {
        this.profile.name = data.name;
        this.profile.imageUrl = data.imageUrl;
      });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }


  openPagePerfil() {
    this.router.navigateByUrl('/perfil', { replaceUrl: true });
  }

  openPageDetails(id: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { uidFood: id },
    };
    this.navCtrl.navigateForward(['food-details'], navigationExtras);
  }

  openPageFavoriteFoods() {
    this.router.navigateByUrl('/create-favorite-foods', { replaceUrl: true });
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnInit(): void {
    const currentWeek = this.dbService.getWeekNunber();
    this.dbService
      .getColectionsComidas('comidas/', currentWeek)
      .then((data) => (this.foods = data.map((el) => el.data())));
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
