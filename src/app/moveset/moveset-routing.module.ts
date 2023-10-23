import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovesetPage } from './moveset.page';

const routes: Routes = [
  {
    path: '',
    component: MovesetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovesetPageRoutingModule {}
