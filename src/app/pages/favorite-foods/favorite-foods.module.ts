import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteFoodsPageRoutingModule } from './favorite-foods-routing.module';

import { FavoriteFoodsPage } from './favorite-foods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteFoodsPageRoutingModule
  ],
  declarations: [FavoriteFoodsPage]
})
export class FavoriteFoodsPageModule {}
