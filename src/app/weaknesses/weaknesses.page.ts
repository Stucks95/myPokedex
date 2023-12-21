import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { LoadingController } from '@ionic/angular';

interface Weaknesses_Resistances_1Types {
  no_damage_from: {name: string}[], 
  half_damage_from: {name: string}[], 
  double_damage_from: {name: string}[]
}

interface Weaknesses_Resistances_2Types {
  x4: string[], 
  x2: string[], 
  x0_5: string[],
  x0_25: string[],
  x0: string[]
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
  weak_res1type: Weaknesses_Resistances_1Types = {no_damage_from: [], half_damage_from: [], double_damage_from: []}
  weak_res2types: Weaknesses_Resistances_2Types = {x4: [], x2: [], x0_5: [], x0_25: [], x0: []}
  types: Type[] = []
  progressLoad: boolean = true
  countTypes: number = 0
  
  allSubs: {}[] = []
  dmgRelationsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  pokeDetailsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  
  constructor(private pokeService: PokemonService, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.showLoading()
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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 1000,
    });

    loading.present();
  }

  getDetails(index: number): void {
    this.pokeDetailsSub.sub = this.pokeService.getPokeDetails(index)
    .subscribe((det: any) => {
      this.pokeDetailsSub.subscribed = true
      this.getDamageRelations(det)
    })
    this.allSubs.push(this.pokeDetailsSub)
  }

  getDamageRelations(det:any): void {
    let damage_relations: Weaknesses_Resistances_1Types[] = []
    this.countTypes = 0
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
      this.countTypes++
    })
    setTimeout(() => {
      if(this.countTypes == 1) {
        this.weak_res1type = damage_relations[0]
        //console.log('this.dm_rel', this.dm_rel)
      }
      if(this.countTypes > 1) {
        this.weak_res2types = this.pokeService.calcDamageRelationsBy2Types(damage_relations)
        //this.dm_rel = this.pokeService.calcDamageRelationsBy2Types(damage_relations)
        //console.log('this.dm_rel', this.dm_rel)
      }
      this.progressLoad = false
    }, 1500)
  }

}
