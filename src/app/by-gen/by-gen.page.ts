import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-by-gen',
  templateUrl: './by-gen.page.html',
  styleUrls: ['./by-gen.page.scss'],
})
export class ByGenPage {

  subRegionPokemon: Subscription
  subInitPokemon: Subscription
  pokemons: { index: number, name: string, url: string, image: string }[]
  regions: { idGen: number, region: string }[]
  customPopoverOptions = {
    header: 'Regions',
  }
  
  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.regions = this.pokeService.getRegions()
    this.loadKantoPokemon()
  }

  ngOnDestroy(): void {
    this.subInitPokemon.unsubscribe()
    this.subRegionPokemon.unsubscribe()
  }

  loadKantoPokemon() {
    this.subInitPokemon = this.pokeService.getPokeByGeneration(1)
    .subscribe((poke: any) => {
      this.pokemons = [...poke]
    })
  }

  loadGen(e: Event): void {
    let objGen: Object = (<HTMLInputElement>e.target).value
    let idGen: number = Object.values(objGen)[0]
    this.subRegionPokemon = this.pokeService.getPokeByGeneration(idGen)
    .subscribe((poke: any) => {
      this.pokemons = [...poke]
      console.log(this.pokemons)
    })
  }

  refreshPage(): void {
    window.location.reload();
  }

}
