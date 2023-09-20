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
    pokeIndex: number | null;
    name: string;
    gen: string;
    description: string;
    homeSprite: string;
    sprites: Array<string>;
    types: Array<string>
  } = {
    pokeIndex: null,
    name: '',
    gen: '',
    description: '',
    homeSprite: '',
    sprites: [],
    types: [] 
  }

  constructor(
    private route: ActivatedRoute, 
    private pokeService: PokemonService) {}

  ngOnInit() {
    // get INDEX
    this.details.pokeIndex = Number (this.route.snapshot.paramMap.get('index'));

    this.pokeService.getPokeDetails(this.details.pokeIndex).subscribe((det: any) => {
      // get pokemon's name
      this.details.name = det['name'];

      // get home sprite
      this.details.homeSprite = det['sprites']['other']['home']['front_default'];
        
      
      // get the 4 sprites
      this.details.sprites[0] = det['sprites']['front_default'];
      this.details.sprites[1] = det['sprites']['back_default'];
      this.details.sprites[2] = det['sprites']['front_shiny'];
      this.details.sprites[3] = det['sprites']['back_shiny'];

      // get types
      det['types'].forEach((type: any) => {
        this.details.types.push(type['type']['name']);
      });
    })

    this.pokeService.getSpecies(this.details.pokeIndex).subscribe((spec : any) => {
      this.details.description = spec['flavor_text_entries'][21]['flavor_text'];
      this.details.gen = spec['generation']['name'];
      console.log('spec: ', spec);
    });
    
  }
}
