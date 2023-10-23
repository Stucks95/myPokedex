import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  appVersion: string = this.pokeService.appVersion
  offset: number

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
  }

  refreshPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {}

}
