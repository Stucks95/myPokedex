import { Component, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('pokeMusic') pokeMusic: QueryList<AudioBuffer>

  appVersion: string = this.pokeService.appVersion
  offset: number
  autoPlay: boolean = false
  volume: number = 0.6

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.pokeMusic = new QueryList<AudioBuffer>()
  }

  ngAfterViewInit(): void {
    this.autoPlay = true
  }

  refreshPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {}

}
