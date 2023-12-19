import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

interface Move {
  name: string, 
  type: string,
  power: number,
  damage: string,
  accuracy: number,
  level: number
}

@Component({
  selector: 'app-moveset',
  templateUrl: './moveset.page.html',
})
export class MovesetPage {

  movesetGen: number | null = null
  levelUpMoveset: Move[] = []
  pokeIndex: number
  appVersion: string = this.pokeService.appVersion
  progressLoad: boolean = true
  skeletonArray: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

  allSubs: {}[] = []
  moves8thGenSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  moves7thGenSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  detailsMoveSub: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  constructor(private pokeService: PokemonService, private loadingCtrl: LoadingController) { }

  ngOnInit(): void {
    this.showLoading()
    this.pokeIndex = this.pokeService.getCurrentPokeId()
    this.getMoves(this.pokeIndex)
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
      duration: 4000,
    });

    loading.present();
  }

  // get 8th or 7th gen moveset
  getMoves(pokeIndex: number): void {
    let levelUp8thGenMoves = this.get8thGenMoveset(pokeIndex)
    let levelUp7thGenMoves = this.get7thGenMoveset(pokeIndex)
    // if there's no 7th gen moveset let's set the 8th gen moveset
    setTimeout(() => {
      let levelUpMoves: {move: {}, version:{}}[]
      if(levelUp8thGenMoves.length == 0) {
        this.movesetGen = 7
        levelUpMoves = levelUp7thGenMoves
      } else {
        this.movesetGen = 8
        levelUpMoves = levelUp8thGenMoves
      }
      this.getDetailsMoves(levelUpMoves)
    }, 3000);
  }

  // moveset 8th gen
  get8thGenMoveset(pokeIndex: number) {
    let levelUp8thGenMoves: {move:{}, version: {}}[] = []
    this.moves8thGenSub.sub = this.pokeService.getMoves(pokeIndex)
    .subscribe((moves: any) => {
      this.moves8thGenSub.subscribed = true
      //console.log('moves',moves)
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

  getDetailsMoves(levelUpMoves: {move: {}, version: {}}[]) {
    levelUpMoves.forEach((move: any) => {  
      this.detailsMoveSub.sub = this.pokeService.getDetailsMove(move.move.url)
      .subscribe((detMove: any) => {
        this.detailsMoveSub.subscribed = true
        this.levelUpMoveset.push({
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
    setTimeout(() => {
      this.levelUpMoveset.sort((a: Move, b: Move) => a.level - b.level)
      this.progressLoad = false
    }, 1000);
  }

  refreshPage(): void {
    window.location.reload()
  }

}
