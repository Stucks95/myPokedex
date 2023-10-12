import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';
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
  animationEnd: boolean = true

  appVersion: string = this.pokeService.appVersion
  offset: number
  subInitPokemon: Subscription
  subAllPokemon: Subscription
  pokemons: { index: number, name: string, url: string, image: string }[]
  allPokemons: { index: number, name: string, url: string, image: string }[]
  regions: { idGen: number, region: string }[]

  // for searching
  searchText: string = ""
  searchingPokemon: boolean = false

  customPopoverOptions = {
    header: 'Regions',
  };

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    // timeout for LOGO ANIMATION
    setTimeout(() => {
      this.animationEnd = true
    }, 5000);

    this.loadPokemonsInit()
    this.regions = this.pokeService.getRegions()
  }

  isSearching(): void {
    if(this.searchText !== '') {
      this.searchingPokemon = true
    }
    else {
      this.searchingPokemon = false
    }
  }

  loadPokemonsInit(): void {
    this.subAllPokemon = this.pokeService.getPokemons(0, this.pokeService.totalPokemons, 1)
    .subscribe((poke: any) => {
      this.allPokemons = [...poke]
    })
    this.subInitPokemon = this.pokeService.getPokemons(0, 50, 1)
    .subscribe((poke: any) => {
      this.pokemons = [...poke]
    })
  }

  loadGen(e: Event): void {
    let objGen: Object = (<HTMLInputElement>e.target).value
    let idGen: number = Object.values(objGen)[0]
    this.subInitPokemon = this.pokeService.getPokeByGeneration(idGen)
    .subscribe((poke: any) => {
      this.pokemons = [...poke]
    })
  }

  refreshPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.subInitPokemon.unsubscribe()
    this.subAllPokemon.unsubscribe()
  }

}

/* 
  loadPokemons(loadMore = false, event?: any): void {
    if(loadMore) {
      this.offset += 25
    }

    this.pokeService.getPokemon(this.offset).subscribe(res => {
      this.pokemons = [...this.pokemons, ...res]

      if(event) {
        event.target.complete();
      }

      if(this.offset >= 150) {
        this.infinite.disabled = true;
        console.log('infinite disable? ', this.infinite.disabled)
      }
    })
  } */
