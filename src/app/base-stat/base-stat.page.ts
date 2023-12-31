import { Component, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';

interface Stat {
  name: string, 
  base_stat: number
}

@Component({
  selector: 'app-base-stat',
  templateUrl: './base-stat.page.html',
})
export class BaseStatPage {

  appVersion: string = this.pokeService.appVersion
  stats: Stat[] = []
  totStats: number | null = 0
  pokeIndex: number
  
  allSubs: {}[] = []
  pokeDetailsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.pokeIndex = this.pokeService.getCurrentPokeId()
    this.getDetails(this.pokeIndex)
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

  getDetails(index: number): void {
    this.pokeDetailsSub.sub = this.pokeService.getPokeDetails(index)
    .subscribe((det: any) => {
      this.pokeDetailsSub.subscribed = true
      this.getStats(det)
    })
    this.allSubs.push(this.pokeDetailsSub)
  }

  getStats(det: any): void {
    det.stats.forEach((s: any) => {
      let cleanName = s.stat.name.replace('-', ' ')
      this.stats.push({name: cleanName, base_stat: s.base_stat})
      this.totStats += s.base_stat 
    })
  }

  refreshPage(): void {
    window.location.reload()
  }

}
