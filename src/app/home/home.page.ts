import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  
  options: AnimationOptions = {
    path: '../../assets/animation_pokemon.json'
  }
  animationEnd: boolean = false

  appVersion: string = this.pokeService.appVersion
  offset: number

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.animationEnd = true
    // timeout for LOGO ANIMATION
    /* setTimeout(() => {
      this.animationEnd = true
    }, 4000); */
  }

  refreshPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {}

}
