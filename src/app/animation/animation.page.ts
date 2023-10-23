import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.page.html',
  styleUrls: ['./animation.page.scss'],
})
export class AnimationPage implements OnInit {
  
  options: AnimationOptions = {
    path: '../../assets/animation_pokemon.json'
  }
  animationEnd: boolean = false

  constructor() {}

  ngOnInit(): void {
    //this.animationEnd = true
    // timeout for LOGO ANIMATION
    setTimeout(() => {
      this.animationEnd = true
      window.location.replace('/home')
    }, 4000);
  }

}
