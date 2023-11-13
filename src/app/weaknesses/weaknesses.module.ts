import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeaknessesPageRoutingModule } from './weaknesses-routing.module';

import { WeaknessesPage } from './weaknesses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeaknessesPageRoutingModule
  ],
  declarations: [WeaknessesPage]
})
export class WeaknessesPageModule {}
