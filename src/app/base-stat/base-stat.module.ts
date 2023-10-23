import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BaseStatPageRoutingModule } from './base-stat-routing.module';

import { BaseStatPage } from './base-stat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseStatPageRoutingModule
  ],
  declarations: [BaseStatPage],
  exports: [BaseStatPage]
})
export class BaseStatPageModule {}
