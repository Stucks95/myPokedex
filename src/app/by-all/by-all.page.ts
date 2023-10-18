import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-by-all',
  templateUrl: './by-all.page.html',
  styleUrls: ['./by-all.page.scss'],
})
export class ByAllPage {

  subAllPokemon: Subscription
  subInitPokemon: Subscription
  pokemons: { index: number, name: string, url: string, image: string }[]
  allPokemons: { index: number, name: string, url: string, image: string }[]
  skeletonLoad: boolean = true
  skeletonArray: number[] = [1,2,3,4,5,6,7,8,9,10]
  // for searching
  searchText: string = ""
  searchingPokemon: boolean = false

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonsInit()
  }

  ngAfterViewInit(): void {
    // skeleton fx 2sec
    setTimeout(() => {
      this.skeletonLoad = false
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subAllPokemon.unsubscribe()
    this.subInitPokemon.unsubscribe()
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

  refreshPage(): void {
    window.location.reload();
  }

}
