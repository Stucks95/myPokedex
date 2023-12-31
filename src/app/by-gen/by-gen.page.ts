import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

interface pokeBaseInfo {
  index: number, 
  name: string, 
  image: string
}

@Component({
  selector: 'app-by-gen',
  templateUrl: './by-gen.page.html',
})
export class ByGenPage {

  allSubs: {}[] = []
  subRegionPokemon: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  subInitPokemon: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  
  pokemons: pokeBaseInfo[]
  appVersion: string = this.pokeService.appVersion
  regions: { idGen: number, region: string }[]
  offset: number = 0
  skeletonLoad: boolean = true
  skeletonArray: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  customPopoverOptions = {
    header: 'Regions',
  }
  
  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.regions = this.pokeService.getRegions()
    this.loadKantoPokemon()
  }

  ngOnDestroy(): void {
    this.unsubscribeAll()
  }

  ngAfterViewInit(): void {
    // skeleton fx 2.5sec
    setTimeout(() => {
      this.skeletonLoad = false
    }, 2500);
  }

  unsubscribeAll(): void {
    this.allSubs.forEach((objSub: any) => {
      if(objSub.subscribed == true) {
        objSub.sub.unsubscribe()
      }
    })
  }

  loadKantoPokemon() {
    this.subInitPokemon.sub = this.pokeService.getPokeByGeneration(1)
    .subscribe((res: any) => {
      this.subInitPokemon.subscribed = true
      this.pokemons = [...res]
    })
    this.allSubs.push(this.subInitPokemon)
  }

  loadGen(e: Event): void {
    this.skeletonLoad = true
    let objGen: Object = (<HTMLInputElement>e.target).value
    let idGen: number = Object.values(objGen)[0]
    this.subRegionPokemon.sub = this.pokeService.getPokeByGeneration(idGen)
    .subscribe((res: any) => {
      this.subRegionPokemon.subscribed = true
      this.pokemons = [...res]
    })
    this.allSubs.push(this.subRegionPokemon)
    setTimeout(() => {
      this.pokemons.sort((a: pokeBaseInfo, b: pokeBaseInfo) => a.index - b.index)
      this.skeletonLoad = false
    }, 1000);
  }

  refreshPage(): void {
    window.location.reload();
  }

}
