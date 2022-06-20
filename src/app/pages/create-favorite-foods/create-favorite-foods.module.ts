import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateFavoriteFoodsPageRoutingModule } from './create-favorite-foods-routing.module';

import { CreateFavoriteFoodsPage } from './create-favorite-foods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateFavoriteFoodsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateFavoriteFoodsPage]
})
export class CreateFavoriteFoodsPageModule {}
