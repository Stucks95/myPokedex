import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

interface Gen {
  region: string, 
  id: number | null
}

interface Evo {
  evo0: {name: string, id: number, img: string}, 
  evo1: {name: string, id: number, img: string}[], 
  evo2: {name: string, id: number, img: string}[]
}

interface Type {
  id: number,
  name: string,
  img: string
}

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
})
export class DetailsPage {

  movesetClicked: boolean
  appVersion: string = this.pokeService.appVersion

  allSubs: {}[] = []
  pokeDetailsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  specEvoSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  evoSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  findPokeSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  dmgRelationsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  details: {
    pokeIndex: number
    name: string
    gen: Gen,
    description: string
    homeSprite: string
    sprites: string[]
    types: Type[]
    evo: Evo
  } = {
    pokeIndex: 0,
    name: '',
    gen: {region: '', id: null},
    description: '',
    homeSprite: '',
    sprites: [],
    types: [],
    evo: {evo0: {name: '', id: 0, img: ''}, evo1: [], evo2: []}
  }

  constructor(private route: ActivatedRoute, private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.details.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))
    this.pokeService.updateCurrentPokeId(this.details.pokeIndex)
  }

  ngAfterViewInit(): void {
    this.getDetails(this.details.pokeIndex)
    this.getEvo(this.details.pokeIndex)
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

  updatePokeId(evoID: number): void {
    this.pokeService.updateCurrentPokeId(evoID)
  }

  getEvo(index: number): void {
    this.evoSub.sub = this.pokeService.getEvolutions(index)
    .subscribe((evo: any) => {
      this.evoSub.subscribed = true
      this.specEvoSub.sub = evo.subscribe((poke: any) => {
        this.specEvoSub.subscribed = true

        this.details.evo.evo0.name = poke.evo0[0].name
        this.details.evo.evo0.id = poke.evo0[0].id
        this.details.evo.evo0.img = this.pokeService.getPokeImage(poke.evo0[0].id)     
        if(poke.evo1) {
          poke.evo1.forEach((p: any) => {
            // EVO 1 pushing
            this.details.evo.evo1.push(
              {name: p.name, id: p.id, img: this.pokeService.getPokeImage(p.id)}
            )
          });
        }
        if(poke.evo2.length != 0) {
          poke.evo2.forEach((p: any) => {
            // EVO 1 pushing
            this.details.evo.evo2.push(
              {name: p.name, id: p.id, img: this.pokeService.getPokeImage(p.id)}
            )
          });
        }
        
      })
    })
    this.allSubs.push(this.evoSub)
    this.allSubs.push(this.specEvoSub)
    this.allSubs.push(this.findPokeSub)
  }

  getDetails(index: number): void {
    this.pokeDetailsSub.sub = this.pokeService.getPokeDetails(index)
    .subscribe((det: any) => {
      this.pokeDetailsSub.subscribed = true
      this.details.name = det.name
      this.details.homeSprite = det.sprites.other.home.front_default
      this.details.gen = this.pokeService.findPokeGen(index)
      this.getTypes(det)
    })
    this.allSubs.push(this.pokeDetailsSub)
  }

  getTypes(det:any): void {
    let countTypes: number = 0
    det.types.forEach((type: any) => {
      // finding id by substringing the url
      let idType: number = this.pokeService.findIDByURL(type.type.url)
      this.details.types.push(
      {
        id: idType, 
        name: type.type.name, 
        img: '../../assets/img/types/'+type.type.name+'.png'
      })
      countTypes++
    })
    setTimeout(() => {
      console.log('this.details.types',this.details.types)
    }, 2000);
  }

  refreshPage(): void {
    window.location.reload()
  }
}
