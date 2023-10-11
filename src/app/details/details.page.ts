import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

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
    evoID: number
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
    evoID: 0
  }

  constructor(
    private route: ActivatedRoute, 
    private pokeService: PokemonService) {}

  ngOnInit() {
    // get INDEX
    this.details.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))

    this.pokeService.getPokeDetails(this.details.pokeIndex)
    .subscribe((det: any) => {
      // get pokemon's name
      this.details.name = det.name

      // get home sprite
      this.details.homeSprite = det.sprites.other.home.front_default
      
      // get the 4 sprites
      this.details.sprites[0] = det.sprites.front_default
      this.details.sprites[1] = det.sprites.back_default
      this.details.sprites[2] = det.sprites.front_shiny
      this.details.sprites[3] = det.sprites.back_shiny

      // get types
      det.types.forEach((type: any) => {
        this.details.types.push(type.type.name)
      })

      //get stats
      det.stats.forEach((s: any) => {
        let cleanName = s.stat.name.replace('-', ' ')
        this.details.stats.push({name: cleanName, base_stat: s.base_stat})
        this.details.totStats += s.base_stat 
      })
    })

    this.pokeService.getEvolutions(this.details.pokeIndex)
    .subscribe((evo: any) => {
      this.details.evoName = evo.chain.evolves_to[0].species.name
      this.pokeService.findPokemon(this.details.evoName)
      .subscribe((poke: any) => {
        this.details.evoID = poke.id
      })
    })
    
  }
}
