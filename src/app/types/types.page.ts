import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

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

  appVersion: string = this.pokeService.appVersion
  allSubs: {}[] = []
  subTypes: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  subDmRel: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

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
      })
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
