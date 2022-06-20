import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteFavoritePageRoutingModule } from './vote-favorite-routing.module';

import { VoteFavoritePage } from './vote-favorite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoteFavoritePageRoutingModule
  ],
  declarations: [VoteFavoritePage]
})
export class VoteFavoritePageModule {}
