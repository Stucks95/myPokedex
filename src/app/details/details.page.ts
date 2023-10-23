import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';
import { IonFabButton } from '@ionic/angular';

interface Gen {
  region: string, 
  id: number | null
}

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  movesetClicked: boolean
  appVersion: string = this.pokeService.appVersion

  allSubs: {}[] = []
  pokeDetailsSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  specEvoSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  evoSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  findPokeSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  details: {
    pokeIndex: number | null
    name: string
    gen: Gen,
    description: string
    homeSprite: string
    sprites: string[]
    types: string[]
    evoName: string,
    evoID: number,
    evoImg: string,
  } = {
    pokeIndex: null,
    name: '',
    gen: {region: '', id: null},
    description: '',
    homeSprite: '',
    sprites: [],
    types: [],
    evoName: '',
    evoID: 0,
    evoImg: '',
  }

  constructor(private route: ActivatedRoute, private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.details.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))
    this.pokeService.updateCurrentPokeId(this.details.pokeIndex)
    this.getDetails(this.details.pokeIndex)
    this.getEvo(this.details.pokeIndex)
  }

  ngAfterViewInit(): void {}

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
    console.log('update ID - evo id = ',evoID)
    this.pokeService.updateCurrentPokeId(evoID)
  }

  getEvo(index: number): void {
      this.evoSub.sub = this.pokeService.getEvolutions(index)
      .subscribe((spec: any) => {
        this.evoSub.subscribed = true
        this.specEvoSub.sub = spec.subscribe((evo: any) => {
          this.specEvoSub.subscribed = true
          this.details.evoID = evo.id
          // i'm in the intermediate pokemon's page
          if(this.details.name == evo.evo1Name) {
            this.details.evoName = evo.evo2Name
          }
          // i'm in the last evo pokemon's page
          else if(this.details.name == evo.evo2Name) {
            this.details.evoName = ''
          }
          // i'm in the pre-evo pokemon's page
          else {
            this.details.evoName = evo.evo1Name
          }
          this.findPokeSub.sub = this.pokeService.findPokemon(this.details.evoName)
          .subscribe((poke: any) => {
            this.findPokeSub.subscribed = true
            this.details.evoID = poke.id
            this.details.evoImg = this.pokeService.getPokeImage(poke.id)
          })
        })
      }
    )
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
      this.getSprites(det)
      this.getTypes(det)
    })
    this.allSubs.push(this.pokeDetailsSub)
  }

  getSprites(det: any): void {
    this.details.sprites[0] = det.sprites.front_default
    this.details.sprites[1] = det.sprites.back_default
    this.details.sprites[2] = det.sprites.front_shiny
    this.details.sprites[3] = det.sprites.back_shiny
  }

  getTypes(det:any): void {
    det.types.forEach((type: any) => {
      this.details.types.push(type.type.name)
    })
  }

  refreshPage(): void {
    window.location.reload()
  }
}
