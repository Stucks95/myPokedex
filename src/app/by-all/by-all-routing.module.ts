import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ByAllPage } from './by-all.page';

const routes: Routes = [
  {
    path: '',
    component: ByAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ByAllPageRoutingModule {}
