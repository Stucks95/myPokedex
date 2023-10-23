import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimationPageRoutingModule } from './animation-routing.module';

import { AnimationPage } from './animation.page';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [
    LottieModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AnimationPageRoutingModule
  ],
  declarations: [AnimationPage]
})
export class AnimationPageModule {}
