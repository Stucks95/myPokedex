import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ByTypePageRoutingModule } from './by-type-routing.module';
import { ByTypePage } from './by-type.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ByTypePageRoutingModule
  ],
  declarations: [ByTypePage]
})
export class ByTypePageModule {}
