import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';
import { IonFabButton } from '@ionic/angular';

interface Move {
  name: string, 
  type: string,
  power: number,
  damage: string,
  accuracy: number,
  level: number
}

interface Stat {
  name: string, 
  base_stat: number
}

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
  @ViewChildren('moveset') movesetFab: QueryList<IonFabButton>
  @ViewChildren('stats') statsFab: QueryList<IonFabButton>

  movesetClicked: boolean
  statsClicked: boolean
  appVersion: string = this.pokeService.appVersion

  //homeViewSubscriptions.forEach(subscription => subscription.unsubscribe());
  allSubs: {}[] = []
  detailsMoveSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  moves8thGenSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  moves7thGenSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
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
    stats: Stat[],
    totStats: number | null
    evoName: string,
    evoID: number,
    evoImg: string,
    levelUpMoveset: Move[],
    movesetGen: number | null
  } = {
    pokeIndex: null,
    name: '',
    gen: {region: '', id: null},
    description: '',
    homeSprite: '',
    sprites: [],
    types: [],
    stats: [],
    totStats: null,
    evoName: '',
    evoID: 0,
    evoImg: '',
    levelUpMoveset: [],
    movesetGen: null
  }

  constructor(private route: ActivatedRoute, private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.statsFab = new QueryList<IonFabButton>()
    this.movesetFab = new QueryList<IonFabButton>() 
    this.details.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))
    this.getDetails(this.details.pokeIndex)
    this.getEvo(this.details.pokeIndex)
    this.getMoves(this.details.pokeIndex)
  }

  ngAfterViewInit(): void {
    this.movesetFab.first.activated = false
    this.statsFab.first.activated = true
    this.movesetClicked = false
    this.statsClicked = true
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

  // get 8th or 7th gen moveset
  getMoves(pokeIndex: number): void {
    let levelUp8thGenMoves = this.get8thGenMoveset(pokeIndex)
    let levelUp7thGenMoves = this.get7thGenMoveset(pokeIndex)
    // if there's no 7th gen moveset let's set the 8th gen moveset
    setTimeout(() => {
      let levelUpMoves: {move: {}, version:{}}[]
      if(levelUp8thGenMoves.length == 0) {
        this.details.movesetGen = 7
        levelUpMoves = levelUp7thGenMoves
      } else {
        this.details.movesetGen = 8
        levelUpMoves = levelUp8thGenMoves
      }
      this.getDetailsMoves(levelUpMoves)
    }, 3000);
  }

  getDetailsMoves(levelUpMoves: {move: {}, version: {}}[]) {
    levelUpMoves.forEach((move: any) => {  
      this.detailsMoveSub.sub = this.pokeService.getDetailsMove(move.move.url)
      .subscribe((detMove: any) => {
        this.detailsMoveSub.subscribed = true
        this.details.levelUpMoveset.push({
          name: detMove.name, 
          type: detMove.type.name,
          power: detMove.power,
          damage: detMove.damage_class.name,
          accuracy: detMove.accuracy,
          level: move.version.level_learned_at
        })
      })
    });
    this.allSubs.push(this.detailsMoveSub)
  }
  
  // moveset 8th gen
  get8thGenMoveset(pokeIndex: number) {
    let levelUp8thGenMoves: {move:{}, version: {}}[] = []
    this.moves8thGenSub.sub = this.pokeService.getMoves(pokeIndex)
    .subscribe((moves: any) => {
      this.moves8thGenSub.subscribed = true
      moves.forEach((move: any) => {
        move.version_group_details.forEach((ver: any) => {
          if(ver.move_learn_method.name == 'level-up' && 
          ver.version_group.name == 'brilliant-diamond-and-shining-pearl' && 
          ver.level_learned_at != 0) {
            levelUp8thGenMoves.push({move: move.move, version: ver})
          }
        });
      });
    })
    this.allSubs.push(this.moves8thGenSub)
    return levelUp8thGenMoves
  }

  // moveset 7th gen
  get7thGenMoveset(pokeIndex: number) {
    let levelUp7thGenMoves: {move:{}, version: {}}[] = []
    this.moves7thGenSub.sub = this.pokeService.getMoves(pokeIndex)
    .subscribe((moves: any) => {
      this.moves7thGenSub.subscribed = true
      moves.forEach((move: any) => {
        move.version_group_details.forEach((ver: any) => {
          if(ver.move_learn_method.name == 'level-up' && 
          ver.version_group.name == 'ultra-sun-ultra-moon' && 
          ver.level_learned_at != 0) {
            levelUp7thGenMoves.push({move: move.move, version: ver})
          }
        });
      });
    })
    this.allSubs.push(this.moves7thGenSub)
    return levelUp7thGenMoves
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
      this.getStats(det)
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

  getStats(det: any): void {
    det.stats.forEach((s: any) => {
      let cleanName = s.stat.name.replace('-', ' ')
      this.details.stats.push({name: cleanName, base_stat: s.base_stat})
      this.details.totStats += s.base_stat 
    })
  }

  statsOnClick() {
    if(this.statsFab.first.activated) {
      this.statsClicked = true
    }
    else {
      this.statsClicked = false
    }
  }

  movesetOnClick(): void {
    this.details.levelUpMoveset.sort((a: Move, b: Move) => a.level - b.level)
    if(this.movesetFab.first.activated) {
      this.movesetClicked = true
    }
    else {
      this.movesetClicked = false
    }
  }

  refreshPage(): void {
    window.location.reload()
  }
}
