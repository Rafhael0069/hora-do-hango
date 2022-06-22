import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      const uidFood = params.uidFood;
      console.log(uidFood);
  });
  }

  openPageHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  ngOnInit() {
  }

}
