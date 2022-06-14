import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateFavoriteFoodsPage } from './create-favorite-foods.page';

const routes: Routes = [
  {
    path: '',
    component: CreateFavoriteFoodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateFavoriteFoodsPageRoutingModule {}
