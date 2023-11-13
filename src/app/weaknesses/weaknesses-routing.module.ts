import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeaknessesPage } from './weaknesses.page';

const routes: Routes = [
  {
    path: '',
    component: WeaknessesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeaknessesPageRoutingModule {}
