import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
} from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { DatabaseService } from 'src/app/services/database.service';
import { PhotoService } from 'src/app/services/photo.service';

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
    private avatarService: AvatarService,
    private authService: AuthService,
    private auth: Auth,
    public photoService: PhotoService,
    private dbService: DatabaseService,
    private router: Router,
    public navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.user = this.auth.currentUser;
    //const listFood = this.dbService.getColectionsComidas('comidas/');
    //console.log(listFood);
    /* listFood.then((list) => {
      //console.log(list[0].data());
      //this.foods = list;
      list.forEach((food) => {
        // this.showData(food.data());
        //console.log(food.id, ' => ', food.data());
      });
      //console.log(list);
    }); */
    //console.log(listFood);
    /* listFood.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(document.id, ' => ', document.data());
    }); */
    this.dbService
      .getUserProfile(`usuarios/${this.user.uid}`)
      .subscribe((data) => {
        this.profile.name = data.name;
        this.profile.imageUrl = data.imageUrl;
      });
  }
  ngOnInit(): void {
    this.dbService
      .getColectionsComidas('comidas/')
      .then((data) => (this.foods = data.map((el) => el.data())));
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  showData(data: any) {
    let cardView = document.getElementById('card-container').innerHTML;
    cardView =
      cardView +
      `<div class="card">
      <ion-img src="${data.imageUrl}"></ion-img>
      <ion-title >${data.nameFood}</ion-title>
    </div>`;

    document.getElementById('card-container').innerHTML = cardView;
  }

  openPagePerfil() {
    this.router.navigateByUrl('/perfil', { replaceUrl: true });
  }

  openPageDetails(id: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {idFood: id}
    };
    this.navCtrl.navigateForward(['food-details'], navigationExtras);
    //this.router.navigateByUrl('/food-details', { replaceUrl: true });
  }

  openPageFavoriteFoods() {
    this.router.navigateByUrl('/create-favorite-foods', { replaceUrl: true });
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
