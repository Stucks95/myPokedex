import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ByGenPageRoutingModule } from './by-gen-routing.module';

import { ByGenPage } from './by-gen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ByGenPageRoutingModule
  ],
  declarations: [ByGenPage]
})
export class ByGenPageModule {}
