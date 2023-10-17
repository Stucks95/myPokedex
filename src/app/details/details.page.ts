import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';
import { IonFabButton } from '@ionic/angular';

interface Move {
  name: string, 
  level: number, 
  type: string
}

interface Stat {
  name: string, 
  base_stat: number
}

interface Gen {
  name: string, 
  id: number
}

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {
  @ViewChildren('moveset') movesetFab: QueryList<IonFabButton>
  @ViewChildren('stats') statsFab: QueryList<IonFabButton>

  specSub: Subscription
  evoSub: Subscription
  findSub: Subscription
  detailsSub: Subscription
  movesSub: Subscription
  detailsMoveSub: Subscription

  appVersion: string = this.pokeService.appVersion
  details: {
    pokeIndex: number | null
    name: string
    gen: {name: string, id: number | null}
    description: string
    homeSprite: string
    sprites: string[]
    types: string[]
    stats: Stat[],
    totStats: number | null
    evoName: string,
    evoID: number,
    evoImg: string,
    movesByLevel: Move[],
  } = {
    pokeIndex: null,
    name: '',
    gen: {name: '', id: null},
    description: '',
    homeSprite: '',
    sprites: [],
    types: [],
    stats: [],
    totStats: null,
    evoName: '',
    evoID: 0,
    evoImg: '',
    movesByLevel: []
  }
  movesetClicked: boolean = false
  statsClicked: boolean = false

  constructor(private route: ActivatedRoute, private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.details.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))
    this.getDetails(this.details.pokeIndex)
    this.getEvo(this.details.pokeIndex)
    this.getMoves(this.details.pokeIndex)
  }

  ngOnDestroy(): void {
    this.specSub.unsubscribe()
    this.evoSub.unsubscribe()
    this.findSub.unsubscribe()
    this.detailsSub.unsubscribe()
    this.detailsMoveSub.unsubscribe()
  }

  getMoves(index: number): void {
    this.movesSub = this.pokeService.getMoves(index)
    .subscribe((poke: any) => {
      poke.moves.forEach((allMoves: any) => {
        allMoves.version_group_details.forEach((move: any) => {
          // find moveset by level up AND brilliant-diamond version
          if(move.move_learn_method.name == 'level-up' && 
          move.version_group.name == 'sword-shield') {
            this.detailsMoveSub = this.pokeService.getDetailsMove(allMoves.move.url)
            .subscribe((detailsMove: any) => {
              this.details.movesByLevel.push({
                name: detailsMove.name.replace('-', ' '), 
                level: move.level_learned_at, 
                type: detailsMove.type.name
              })
            })
          }
        })
      })
    })
  }

  movesetOnClick(): void {
    this.details.movesByLevel.sort((a: Move, b: Move) => a.level - b.level)
    if(this.movesetFab.first.activated) {
      this.movesetClicked = true
    }
    else {
      this.movesetClicked = false
    }
  }

  statsOnClick() {
    if(this.statsFab.first.activated) {
      this.statsClicked = true
    }
    else {
      this.statsClicked = false
    }
  }

  getEvo(index: number): void {
    this.specSub = this.pokeService.getEvolutions(index)
    .subscribe((spec: any) => {
      this.evoSub = spec.subscribe((evo: any) => {
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
        this.findSub = this.pokeService.findPokemon(this.details.evoName)
        .subscribe((poke: any) => {
          this.details.evoID = poke.id
          this.details.evoImg = this.pokeService.getPokeImage(poke.id)
        })
      })
    })
  }

  getDetails(index: number): void {
    this.detailsSub = this.pokeService.getPokeDetails(index)
    .subscribe((det: any) => {
      this.details.name = det.name
      this.details.homeSprite = det.sprites.other.home.front_default

      console.log(this.pokeService.findPokeGen(index))
      this.getSprites(det)
      this.getTypes(det)
      this.getStats(det)
    })
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

  getStats(det: any): void {
    det.stats.forEach((s: any) => {
      let cleanName = s.stat.name.replace('-', ' ')
      this.details.stats.push({name: cleanName, base_stat: s.base_stat})
      this.details.totStats += s.base_stat 
    })
  }
}
