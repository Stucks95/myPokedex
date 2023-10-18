import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';

import { IonicModule } from '@ionic/angular';
import { ByAllPageRoutingModule } from './by-all-routing.module';
import { ByAllPage } from './by-all.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ByAllPageRoutingModule,
  ],
  declarations: [ByAllPage, FilterPipe]
})
export class ByAllPageModule {}
