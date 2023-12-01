import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-type',
  templateUrl: './type.page.html',
})
export class TypePage {

  appVersion: string = this.pokeService.appVersion
  idType: number = 0

  allSubs: {}[] = []
  dmgRelationsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  dm_rel: Damage_Relations = {no_damage_from: [], half_damage_from: [], double_damage_from: []}
  
  constructor(private route: ActivatedRoute, private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.idType = Number (this.route.snapshot.paramMap.get('index'))
  }

  ngAfterViewInit(): void {
    this.getDamageRelations()
  }

  getDamageRelations(): void {
    // get damage_relations for the type
    this.dmgRelationsSub.sub = this.pokeService.getDamageRelationsByType(this.idType)
    .subscribe((damage_rel : Damage_Relations) => {
      this.dmgRelationsSub.subscribed = true
      this.dm_rel = damage_rel
    })

    setTimeout(() => {
      console.log('this.dm_rel',this.dm_rel)
    }, 2000);
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

}
