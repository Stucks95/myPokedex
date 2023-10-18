import { Component, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-by-gen',
  templateUrl: './by-gen.page.html',
  styleUrls: ['./by-gen.page.scss'],
})
export class ByGenPage {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll

  subRegionPokemon: Subscription
  subInitPokemon: Subscription
  pokemons: { index: number, name: string, url: string, image: string }[]
  regions: { idGen: number, region: string }[]
  offset: number = 0
  skeletonLoad: boolean = true
  skeletonArray: number[] = [1,2,3,4,5,6,7,8,9,10]
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

  ngAfterViewInit(): void {
    // skeleton fx 2sec
    setTimeout(() => {
      this.skeletonLoad = false
    }, 2000);
  }

  loadKantoPokemon() {
    this.subInitPokemon = this.pokeService.getPokeByGeneration(1)
    .subscribe((res: any) => {
      this.pokemons = [...res]
    })
  }

  loadGen(e: Event): void {
    let objGen: Object = (<HTMLInputElement>e.target).value
    let idGen: number = Object.values(objGen)[0]
    this.subRegionPokemon = this.pokeService.getPokeByGeneration(idGen)
    .subscribe((res: any) => {
      this.pokemons = [...res]
    })
  }

  refreshPage(): void {
    window.location.reload();
  }

}
