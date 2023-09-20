import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  offset = 0;
  pokemon: any = [];

  @ViewChild(IonInfiniteScroll) infinite!: IonInfiniteScroll;

  constructor(private pokeService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(loadMore = false, event?: any) {
    if(loadMore) {
      this.offset += 25;
    }

    this.pokeService.getPokemon(this.offset).subscribe(res => {
      this.pokemon = [...this.pokemon, ...res];

      if(event) {
        event.target.complete();
      }

      if(this.offset >= 150) {
        this.infinite.disabled = true;
        console.log('infinite disable? ', this.infinite.disabled);
      }
    });
  }

  onSearchChange(e: any): void {
    let value = e.detail.value;

    if(value=='') {
      this.offset = 0;
      this.loadPokemons();
      return;
    }

    this.pokeService.findPokemon(value).subscribe(res => {
      this.pokemon = [res];
    }, err => {
      this.pokemon = [];
    })
  }

  loadGen1() {
    /*
    this.pokeService.getAllPokemons().subscribe(res => {
      this.pokemon = [...this.pokemon, ...res];
      console.log('this.pokemon: ', this.pokemon);
    });
    */
  }

}
