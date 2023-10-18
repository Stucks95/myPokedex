import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ByGenPage } from './by-gen.page';

const routes: Routes = [
  {
    path: '',
    component: ByGenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ByGenPageRoutingModule {}
