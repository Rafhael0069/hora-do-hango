import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit {

  foodDetails = null;
  currentVotes;
  profile = null;
  uidFood;
  imageFoodUrl = null;
  user;
  currentWeek;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dbService: DatabaseService,
    private loadingController: LoadingController
  ) {
    this.currentWeek = this.dbService.getWeekNunber();
    this.user = this.auth.currentUser;
    this.dbService
      .getUserProfile(`usuarios/${this.user.uid}`)
      .subscribe((data) => {
        this.profile = data;
        if (this.currentWeek <= data.lastWeekVote) {
          document.getElementById('bntVote').setAttribute('disabled', 'true');
        }
      });
    this.route.queryParams.subscribe((params) => {
      this.uidFood = params.uidFood;
      this.displayDetailsOnScreen(this.uidFood);
    });
  }

  async displayDetailsOnScreen(uidFood: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.dbService
      .getFoodDetails(`comidas/${uidFood}`)
      .subscribe(async (data) => {
        this.currentVotes = data.votes;
        this.imageFoodUrl = data.imageUrl;
        document.getElementById('nameFood').textContent = data.nameFood;
        document.getElementById('votes').textContent = data.votes;
        document.getElementById('foodIngredientes').textContent =
          data.mainIngredients;
        await loading.dismiss();
      });
  }

  async voteFood() {
    const alert = await this.alertCtrl.create({
      header: 'Comfirmar voto.',
      message: 'Voce tem certeza que deseja votar nesse prato?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.updateVotes();
          },
        },
        {
          text: 'Cancelar',
        },
      ],
    });
    alert.present();
  }

  async updateVotes() {
    const loading = await this.loadingController.create();
    await loading.present();

    const newVotes = this.currentVotes + 1;
    const result = await this.dbService.updateDadosVotes(
      `usuarios/${this.user.uid}`,
      `comidas/${this.uidFood}`,
      this.currentWeek,
      newVotes
    );
    if (result) {
      this.openPageHome();
      await loading.dismiss();
    } else {
      await loading.dismiss();
      this.dbService.presentAlert(
        'Falha ao salvar votos.',
        'Por favor, tente novamente!'
      );
    }
  }

  openPageHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  ngOnInit() {}
}
