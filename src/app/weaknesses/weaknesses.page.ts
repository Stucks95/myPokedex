import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';

interface Damage_Relations {
  no_damage_from: {name: string}[], 
  half_damage_from: {name: string}[], 
  double_damage_from: {name: string}[]
}

interface Type {
  id: number,
  name: string
}

@Component({
  selector: 'app-weaknesses',
  templateUrl: './weaknesses.page.html',
})
export class WeaknessesPage {

  appVersion: string = this.pokeService.appVersion
  pokeIndex: number
  dm_rel: Damage_Relations = {no_damage_from: [], half_damage_from: [], double_damage_from: []}
  types: Type[] = []
  
  allSubs: {}[] = []
  dmgRelationsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  pokeDetailsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  
  constructor(private pokeService: PokemonService) {}

  ngOnInit() {
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
      this.getTypes(det)
    })
    this.allSubs.push(this.pokeDetailsSub)
  }

  getTypes(det:any): void {
    let damage_relations: Damage_Relations[] = []
    let countTypes: number = 0
    det.types.forEach((type: any) => {
      // finding id by substringing the url
      let idType: number = this.pokeService.findIDByURL(type.type.url)
      this.types.push(
      {
        id: idType, name: type.type.name
      })
      // damage_relations for every type
      this.dmgRelationsSub.sub = this.pokeService.getDamageRelationsByType(idType)
      .subscribe((dm_rel: any) => {
        this.dmgRelationsSub.subscribed = true
        damage_relations.push({
          no_damage_from: dm_rel.no_damage_from, 
          half_damage_from: dm_rel.half_damage_from, 
          double_damage_from: dm_rel.double_damage_from
        })
      })
      countTypes++
    })
    setTimeout(() => {
      if(countTypes == 1) {
        this.dm_rel = damage_relations[0]
        console.log('this.dm_rel', this.dm_rel)
      }
      if(countTypes > 1) {
        this.dm_rel = this.pokeService.calculateDamageRelationsBy2Types(damage_relations)
        console.log('this.dm_rel', this.dm_rel)
      }
    }, 2000);
  }

}
