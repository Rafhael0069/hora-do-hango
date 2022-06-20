import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoteFavoritePage } from './vote-favorite.page';

const routes: Routes = [
  {
    path: '',
    component: VoteFavoritePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteFavoritePageRoutingModule {}
