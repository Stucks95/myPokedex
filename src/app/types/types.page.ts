import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

interface Damage_Relations {
  no_damage_from: {name: string}[], 
  half_damage_from: {name: string}[], 
  double_damage_from: {name: string}[]
}

interface Type {
  id: number,
  name: string,
  img: string
}

@Component({
  selector: 'app-types',
  templateUrl: './types.page.html'
})
export class TypesPage {

  allSubs: {}[] = []
  subTypes: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  subDmRel: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  dmRelByTypes: Damage_Relations[] = []
  types: Type[] = []
  countTypes: number = 0

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.getTypes()
  }

  getTypes(): void {
    this.subTypes.sub = this.pokeService.getTypes()
    .subscribe((resTypes: any) => {
      this.subTypes.subscribed = true
      this.countTypes = resTypes.count
      
      resTypes.results.forEach((elType: any) => {
        // finding id by substringing the url
        let idType: number = this.pokeService.findIDByURL(elType.url)
        this.types.push(
        {
          id: idType, 
          name: elType.name, 
          img: '../../assets/img/types/'+elType.name+'.png'
        })

        // finding damage relation by every type
        this.subDmRel.sub = this.pokeService.getDamageRelationsByType(idType)
        .subscribe((res: any) => {
          this.subDmRel.subscribed = true
          this.dmRelByTypes.push({
            no_damage_from: res.no_damage_from, 
            half_damage_from: res.half_damage_from,
            double_damage_from: res.double_damage_from
          })
        })
      })

      setTimeout(() => {
        console.log('this.dmRelByTypes',this.dmRelByTypes)
      }, 4000);
      
    })
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
