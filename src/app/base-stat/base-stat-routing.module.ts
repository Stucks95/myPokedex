import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseStatPage } from './base-stat.page';

const routes: Routes = [
  {
    path: '',
    component: BaseStatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseStatPageRoutingModule {}
