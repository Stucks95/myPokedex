import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

interface pokeBaseInfo {
  index: number, 
  name: string, 
  image: string
}

@Component({
  selector: 'app-by-all',
  templateUrl: './by-all.page.html',
  styleUrls: ['./by-all.page.scss'],
})
export class ByAllPage {

  allSubs: {}[] = []
  subAllPokemon: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  subInitPokemon: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  
  pokemons: pokeBaseInfo[]
  allPokemons: pokeBaseInfo[]

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
    // skeleton fx 3sec
    setTimeout(() => {
      this.skeletonLoad = false
    }, 3000);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll()
  }

  unsubscribeAll(): void {
    this.allSubs.forEach((objSub: any) => {
      if(objSub.subscribed == true) {
        objSub.sub.unsubscribe()
      }
    })
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
    this.subAllPokemon.sub = this.pokeService.getPokemons(0, this.pokeService.totalPokemons, 1)
    .subscribe((poke: any) => {
      this.subAllPokemon.subscribed = true
      this.allPokemons = [...poke]
    })
    this.subInitPokemon.sub = this.pokeService.getPokemons(0, 50, 1)
    .subscribe((poke: any) => {
      this.subInitPokemon.subscribed = true
      this.pokemons = [...poke]
    })
    setTimeout(() => {
      this.pokemons.sort((a: pokeBaseInfo, b: pokeBaseInfo) => a.index - b.index)
      console.log(this.pokemons)
      this.skeletonLoad = false
    }, 2000);
  }

  refreshPage(): void {
    window.location.reload();
  }

}
