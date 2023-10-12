import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  specSub: Subscription
  evoSub: Subscription
  findSub: Subscription
  detailsSub: Subscription
  movesSub: Subscription

  appVersion: string = this.pokeService.appVersion
  details: {
    pokeIndex: number | null
    name: string
    gen: string
    description: string
    homeSprite: string
    sprites: string[]
    types: string[]
    stats: { name: string, base_stat: number }[],
    totStats: number | null
    evoName: string,
    evoID: number,
    evoImg: string,
    learnedMoves: { name: string, level: number }[],
  } = {
    pokeIndex: null,
    name: '',
    gen: '',
    description: '',
    homeSprite: '',
    sprites: [],
    types: [],
    stats: [],
    totStats: null,
    evoName: '',
    evoID: 0,
    evoImg: '',
    learnedMoves: []
  }
  versionsMove: []

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
  }

  getMoves(index: number) {
    this.movesSub = this.pokeService.getMoves(index)
    .subscribe((poke: any) => {
      poke.moves.forEach((allMoves: any) => {
        let nameMove = allMoves.move.name
        this.versionsMove = allMoves.version_group_details

        // last version of the move 'brilliant-diamond-and-shining-pearl'
        if(this.versionsMove[this.versionsMove.length-1] != 0) {
          let levelLearned = this.versionsMove[this.versionsMove.length-1]
          this.details.learnedMoves.push({name: nameMove, level: levelLearned})
        }
      });
    })
    console.log(this.details.learnedMoves)
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
