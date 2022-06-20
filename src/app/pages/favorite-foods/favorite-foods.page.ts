import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-foods',
  templateUrl: './favorite-foods.page.html',
  styleUrls: ['./favorite-foods.page.scss'],
})
export class FavoriteFoodsPage implements OnInit {

  constructor(
    private router: Router,) { }

  openPagecreateFavoriteFoods() {
    this.router.navigateByUrl('/create-favorite-foods', { replaceUrl: true });
  }

  ngOnInit() {
  }

}
