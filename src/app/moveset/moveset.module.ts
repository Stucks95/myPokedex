import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovesetPageRoutingModule } from './moveset-routing.module';

import { MovesetPage } from './moveset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovesetPageRoutingModule
  ],
  declarations: [MovesetPage]
})
export class MovesetPageModule {}
