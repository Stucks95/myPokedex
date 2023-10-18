import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ByTypePage } from './by-type.page';

const routes: Routes = [
  {
    path: '',
    component: ByTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ByTypePageRoutingModule {}
